const nano = require('nano');
const https = require('https');
const logger = require('../utils/logger');

class CouchDBService {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.db = null;
  }

  /**
   * Initialize CouchDB connection
   */
  async connect() {
    try {
      const url = new URL(this.config.url);
      url.username = this.config.username;
      url.password = this.config.password;

      // Create custom agent for self-signed certificates
      const rejectUnauthorized = this.config.rejectUnauthorized !== 'false';
      const httpsAgent = new https.Agent({
        rejectUnauthorized: rejectUnauthorized
      });

      this.connection = nano({
        url: url.toString(),
        requestDefaults: {
          agent: httpsAgent,
          rejectUnauthorized: rejectUnauthorized
        }
      });

      this.db = this.connection.db.use(this.config.database);
      
      // Test connection
      await this.db.info();
      logger.info('Connected to CouchDB successfully');
      
      return true;
    } catch (error) {
      logger.error('Failed to connect to CouchDB:', error);
      throw error;
    }
  }

  /**
   * Listen for changes in the database
   * @param {Function} callback - Callback function to handle changes
   * @param {Object} lastSeq - Last sequence number processed
   */
  async watchChanges(callback, lastSeq = 'now') {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }

    const feed = this.db.changesReader.start({
      since: lastSeq,
      includeDocs: true,
      live: true,
      timeout: 30000
    });

    feed.on('change', (change) => {
      // Filter for death_review and cha_verbal_autopsy forms
      if (change.doc && !change.deleted) {
        if (change.doc.form === 'death_review') {
          logger.info(`New death_review detected: ${change.id}`);
          callback(change.doc, change.seq);
        } else if (change.doc.form === 'cha_verbal_autopsy') {
          logger.info(`New cha_verbal_autopsy detected: ${change.id}`);
          callback(change.doc, change.seq);
        }
      }
    });

    feed.on('error', (error) => {
      logger.error('CouchDB changes feed error:', error);
    });

    logger.info('Started watching CouchDB changes feed');
    return feed;
  }

  /**
   * Get a specific document by ID
   * @param {string} docId - Document ID
   */
  async getDocument(docId) {
    try {
      return await this.db.get(docId);
    } catch (error) {
      logger.error(`Failed to get document ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Query documents by form type
   * @param {string} formType - Form type to query
   * @param {number} limit - Maximum number of results
   */
  async getDocumentsByForm(formType, limit = 100) {
    try {
      const result = await this.db.view('medic-client', 'reports_by_form', {
        key: [formType],
        include_docs: true,
        reduce: false,
        limit: limit
      });
      return result.rows.map(row => row.doc);
    } catch (error) {
      logger.error(`Failed to query documents by form ${formType}:`, error);
      throw error;
    }
  }
}

module.exports = CouchDBService;
