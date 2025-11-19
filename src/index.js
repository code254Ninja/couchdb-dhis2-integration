require('dotenv').config();
const logger = require('./utils/logger');
const CouchDBService = require('./services/couchdb');
const DHIS2Service = require('./services/dhis2');
const SyncStateManager = require('./services/sync-state');
const fieldMapping = require('./config/field-mapping');

class IntegrationService {
  constructor() {
    // Initialize services
    this.couchdb = new CouchDBService({
      url: process.env.COUCHDB_URL,
      username: process.env.COUCHDB_USERNAME,
      password: process.env.COUCHDB_PASSWORD,
      database: process.env.COUCHDB_DATABASE,
      rejectUnauthorized: process.env.COUCHDB_REJECT_UNAUTHORIZED
    });

    this.dhis2 = new DHIS2Service({
      url: process.env.DHIS2_URL,
      ip: process.env.DHIS2_IP,
      username: process.env.DHIS2_USERNAME,
      password: process.env.DHIS2_PASSWORD
    });

    this.syncState = new SyncStateManager();
    this.isRunning = false;
  }

  /**
   * Initialize all services
   */
  async initialize() {
    try {
      logger.info('=== Starting CouchDB to DHIS2 Integration Service ===');
      
      // Connect to CouchDB
      await this.couchdb.connect();
      
      // Initialize DHIS2 client
      this.dhis2.initialize();
      await this.dhis2.testConnection();
      
      // Log sync stats
      const stats = this.syncState.getStats();
      logger.info('Sync statistics:', stats);
      
      this.isRunning = true;
      logger.info('Integration service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize integration service:', error);
      throw error;
    }
  }

  /**
   * Process a death review document
   * @param {Object} doc - CouchDB document
   * @param {string} seq - Sequence number
   */
  async processDeathReview(doc, seq) {
    try {
      // Check if already synced
      if (this.syncState.isDocumentSynced(doc._id)) {
        logger.debug(`Document ${doc._id} already synced, skipping`);
        return;
      }

      logger.info(`Processing death review: ${doc._id}`);

      // Transform to DHIS2 event format
      const event = fieldMapping.transformToTrackerEvent(doc, {
        program: process.env.DHIS2_PROGRAM,
        programStage: process.env.DHIS2_PROGRAM_STAGE,
        orgUnit: process.env.DHIS2_ORG_UNIT
      });

      // Don't set event ID - let DHIS2 auto-generate valid UIDs
      // Track using CouchDB document ID instead
      logger.debug('Transformed event:', JSON.stringify(event, null, 2));

      // Post to DHIS2
      const result = await this.dhis2.postEvent(event);

      // Mark as synced
      this.syncState.markDocumentSynced(doc._id, {
        dhis2EventId: event.event || 'auto-generated',
        dhis2Response: result.status
      });

      // Update sequence only if provided (not during backfill)
      if (seq) {
        this.syncState.updateLastSeq(seq);
      }

      logger.info(`Successfully synced document ${doc._id} to DHIS2`);
    } catch (error) {
      logger.error(`Failed to process document ${doc._id}:`, error);
      // Don't throw - continue processing other documents
    }
  }

  /**
   * Start watching for changes
   */
  async start() {
    if (!this.isRunning) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      const lastSeq = this.syncState.getLastSeq();
      logger.info(`Starting to watch changes from sequence: ${lastSeq}`);

      await this.couchdb.watchChanges(
        (doc, seq) => this.processDeathReview(doc, seq),
        lastSeq
      );

      logger.info('Integration service is now running and watching for changes');
    } catch (error) {
      logger.error('Failed to start integration service:', error);
      throw error;
    }
  }

  /**
   * Process historical death reviews (backfill)
   * @param {number} limit - Maximum number of documents to process
   */
  async backfillHistoricalData(limit = 100) {
    try {
      logger.info(`Starting backfill of historical death reviews (limit: ${limit})`);

      const docs = await this.couchdb.getDocumentsByForm('death_review', limit);
      logger.info(`Found ${docs.length} death review documents`);

      let processed = 0;
      let skipped = 0;

      for (const doc of docs) {
        if (this.syncState.isDocumentSynced(doc._id)) {
          skipped++;
          continue;
        }

        // Don't update sequence during backfill - pass null
        await this.processDeathReview(doc, null);
        processed++;

        // Small delay to avoid overwhelming DHIS2 API
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      logger.info(`Backfill complete: ${processed} processed, ${skipped} skipped`);
    } catch (error) {
      logger.error('Backfill failed:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      stats: this.syncState.getStats()
    };
  }
}

// Main execution
async function main() {
  const service = new IntegrationService();

  try {
    // Initialize service
    await service.initialize();

    // Backfill historical data - sync existing death reviews
    await service.backfillHistoricalData(100);

    // Start watching for new changes
    await service.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = IntegrationService;
