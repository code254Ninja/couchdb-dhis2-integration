#!/usr/bin/env node
/**
 * Test mode - Watches CouchDB and logs transformed events without pushing to DHIS2
 */

require('dotenv').config();
const logger = require('./src/utils/logger');
const CouchDBService = require('./src/services/couchdb');
const SyncStateManager = require('./src/services/sync-state');
const fieldMapping = require('./src/config/field-mapping');

class TestIntegrationService {
  constructor() {
    this.couchdb = new CouchDBService({
      url: process.env.COUCHDB_URL,
      username: process.env.COUCHDB_USERNAME,
      password: process.env.COUCHDB_PASSWORD,
      database: process.env.COUCHDB_DATABASE,
      rejectUnauthorized: process.env.COUCHDB_REJECT_UNAUTHORIZED
    });

    this.syncState = new SyncStateManager();
    this.isRunning = false;
  }

  async initialize() {
    try {
      console.log('\n=== TEST MODE: CouchDB to DHIS2 Integration ===');
      console.log('NOTE: This will NOT push to DHIS2, only log what would be sent\n');
      
      await this.couchdb.connect();
      
      const stats = this.syncState.getStats();
      logger.info('Sync statistics:', stats);
      
      this.isRunning = true;
      logger.info('Test service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize test service:', error);
      throw error;
    }
  }

  async processDocument(doc, seq) {
    try {
      if (this.syncState.isDocumentSynced(doc._id)) {
        logger.debug(`Document ${doc._id} already processed, skipping`);
        return;
      }

      const formType = doc.form || 'unknown';
      console.log(`\n${'='.repeat(70)}`);
      console.log(`Processing ${formType}: ${doc._id}`);
      console.log(`${'='.repeat(70)}`);

      // Transform to DHIS2 event format
      const event = fieldMapping.transformToTrackerEvent(doc, {
        program: process.env.DHIS2_PROGRAM,
        programStage: process.env.DHIS2_PROGRAM_STAGE,
        orgUnit: process.env.DHIS2_ORG_UNIT
      });

      // Check if transformation returned null (e.g., non-maternal death for VA)
      if (!event) {
        console.log(`\n⚠️  Document skipped - does not meet criteria for DHIS2 sync`);
        console.log(`   (e.g., non-maternal death for verbal autopsy)\n`);
        return;
      }

      event.event = `medic-${doc._id}`;

      // Pretty print the transformed event
      console.log('\n📋 DHIS2 Event (would be sent):');
      console.log(JSON.stringify(event, null, 2));

      // Show key fields for quick review
      const fields = doc.fields || {};
      const review = fields.group_review || {};
      
      console.log('\n📊 Summary:');
      console.log(`  Form Type: ${formType}`);
      console.log(`  Patient: ${fields.patient_name || fields.patient_name_display || 'N/A'}`);
      console.log(`  Age: ${fields.patient_age_in_years || 'N/A'} years`);
      console.log(`  Sex: ${fields.patient_sex || 'N/A'}`);
      console.log(`  Date of Death: ${fields.date_of_death || 'N/A'}`);
      
      if (formType === 'death_review') {
        console.log(`  Place: ${review.place_of_death || 'N/A'}`);
        console.log(`  Cause: ${review.probable_cause_of_death || 'N/A'}`);
      } else if (formType === 'cha_verbal_autopsy') {
        console.log(`  Pregnant at Death: ${fields.pregnant_at_death || 'N/A'}`);
        console.log(`  Cause: ${fields.cause_of_death || fields.possible_cause_of_death || 'N/A'}`);
        console.log(`  Medical Condition: ${fields.known_medical_condition || 'N/A'}`);
      }
      
      console.log(`  Data Values: ${event.dataValues.length} fields mapped`);
      
      console.log('\n✓ Would be posted to DHIS2 Tracker API');
      console.log(`  Endpoint: ${process.env.DHIS2_URL}/api/tracker`);
      console.log(`  Program: ${event.program}`);
      console.log(`  Program Stage: ${event.programStage}`);
      console.log(`  Org Unit: ${process.env.DHIS2_ORG_UNIT}\n`);

      // Mark as synced (in test mode)
      this.syncState.markDocumentSynced(doc._id, {
        dhis2EventId: event.event,
        testMode: true
      });

      this.syncState.updateLastSeq(seq);

      logger.info(`Test processed document ${doc._id}`);
    } catch (error) {
      logger.error(`Failed to process document ${doc._id}:`, error);
      console.error('\n❌ Error details:', error.message);
    }
  }

  async start() {
    if (!this.isRunning) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      const lastSeq = this.syncState.getLastSeq();
      console.log(`\n👀 Watching for death_review and cha_verbal_autopsy submissions from sequence: ${lastSeq}`);
      console.log('Submit a death_review or cha_verbal_autopsy form in the app to see the transformation...\n');

      await this.couchdb.watchChanges(
        (doc, seq) => this.processDocument(doc, seq),
        lastSeq
      );

      logger.info('Test service is now running and watching for changes');
    } catch (error) {
      logger.error('Failed to start test service:', error);
      throw error;
    }
  }

  async processExisting(formType = 'death_review', limit = 5) {
    try {
      console.log(`\n📁 Processing existing ${formType} forms (limit: ${limit})...\n`);

      const docs = await this.couchdb.getDocumentsByForm(formType, limit);
      console.log(`Found ${docs.length} ${formType} document(s)\n`);

      for (const doc of docs) {
        await this.processDocument(doc, 'existing');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('\n✓ Finished processing existing documents');
    } catch (error) {
      logger.error('Failed to process existing documents:', error);
      throw error;
    }
  }
}

async function main() {
  const service = new TestIntegrationService();

  try {
    await service.initialize();

    // Process existing documents
    const args = process.argv.slice(2);
    if (args.includes('--existing')) {
      const limit = parseInt(args[args.indexOf('--existing') + 1]) || 5;
      await service.processExisting(limit);
    }

    // Start watching
    if (!args.includes('--no-watch')) {
      await service.start();
    } else {
      console.log('\n✓ Test completed. Use --existing <limit> to process existing documents.');
      process.exit(0);
    }

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\nShutting down...');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
