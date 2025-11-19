const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class SyncStateManager {
  constructor(stateFilePath = path.join(__dirname, '../../sync-state.json')) {
    this.stateFilePath = stateFilePath;
    this.state = {
      lastSeq: 'now',
      syncedDocuments: {},
      lastSyncTime: null
    };
    this.loadState();
  }

  /**
   * Load sync state from file
   */
  loadState() {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const data = fs.readFileSync(this.stateFilePath, 'utf8');
        this.state = JSON.parse(data);
        logger.info('Loaded sync state from file');
      } else {
        logger.info('No existing sync state found, starting fresh');
      }
    } catch (error) {
      logger.error('Failed to load sync state:', error);
    }
  }

  /**
   * Save sync state to file
   */
  saveState() {
    try {
      fs.writeFileSync(
        this.stateFilePath, 
        JSON.stringify(this.state, null, 2),
        'utf8'
      );
      logger.debug('Saved sync state to file');
    } catch (error) {
      logger.error('Failed to save sync state:', error);
    }
  }

  /**
   * Check if document has been synced
   * @param {string} docId - Document ID
   */
  isDocumentSynced(docId) {
    return this.state.syncedDocuments.hasOwnProperty(docId);
  }

  /**
   * Mark document as synced
   * @param {string} docId - Document ID
   * @param {Object} metadata - Additional metadata about the sync
   */
  markDocumentSynced(docId, metadata = {}) {
    this.state.syncedDocuments[docId] = {
      syncedAt: new Date().toISOString(),
      ...metadata
    };
    this.saveState();
  }

  /**
   * Update last sequence number
   * @param {string} seq - Sequence number
   */
  updateLastSeq(seq) {
    this.state.lastSeq = seq;
    this.state.lastSyncTime = new Date().toISOString();
    this.saveState();
  }

  /**
   * Get last sequence number
   */
  getLastSeq() {
    return this.state.lastSeq;
  }

  /**
   * Get sync statistics
   */
  getStats() {
    return {
      totalSynced: Object.keys(this.state.syncedDocuments).length,
      lastSyncTime: this.state.lastSyncTime,
      lastSeq: this.state.lastSeq
    };
  }

  /**
   * Clear all synced documents (useful for re-sync)
   */
  clearSyncedDocuments() {
    this.state.syncedDocuments = {};
    this.saveState();
    logger.info('Cleared all synced documents');
  }
}

module.exports = SyncStateManager;
