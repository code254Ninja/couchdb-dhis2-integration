const axios = require('axios');
const logger = require('../utils/logger');

class DHIS2Service {
  constructor(config) {
    this.config = config;
    this.client = null;
  }

  /**
   * Initialize DHIS2 client
   */
  initialize() {
    const axiosConfig = {
      baseURL: this.config.url,
      auth: {
        username: this.config.username,
        password: this.config.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Handle DNS resolution issue for histracker.health.go.ke
    if (this.config.ip && this.config.url.includes('histracker.health.go.ke')) {
      const https = require('https');
      const dns = require('dns');
      
      // Override DNS lookup to use configured IP
      axiosConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        lookup: (hostname, options, callback) => {
          if (hostname === 'histracker.health.go.ke') {
            callback(null, this.config.ip, 4);
          } else {
            dns.lookup(hostname, options, callback);
          }
        }
      });
      
      logger.info(`Using custom DNS resolution: histracker.health.go.ke -> ${this.config.ip}`);
    }

    this.client = axios.create(axiosConfig);
    logger.info('DHIS2 client initialized');
  }

  /**
   * Test DHIS2 connection
   */
  async testConnection() {
    try {
      const response = await this.client.get('/api/system/info');
      logger.info(`Connected to DHIS2: ${response.data.version}`);
      return true;
    } catch (error) {
      logger.error('Failed to connect to DHIS2:', error.message);
      throw error;
    }
  }

  /**
   * Post event to DHIS2 Tracker
   * @param {Object} event - Event object in DHIS2 format
   */
  async postEvent(event) {
    try {
      const payload = {
        events: [event]
      };

      logger.debug('Posting event to DHIS2:', JSON.stringify(payload, null, 2));

      const response = await this.client.post('/api/tracker', payload, {
        params: {
          async: false,
          importStrategy: 'CREATE_AND_UPDATE'
        }
      });

      if (response.data.status === 'OK') {
        logger.info('Event successfully posted to DHIS2:', {
          eventId: event.event,
          httpStatusCode: response.data.httpStatusCode
        });
        return response.data;
      } else {
        logger.error('DHIS2 returned non-OK status:', response.data);
        throw new Error(`DHIS2 import failed: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        logger.error('DHIS2 API error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: errorData
        });
        
        // Log validation errors if present
        if (errorData && errorData.response && errorData.response.importSummaries) {
          errorData.response.importSummaries.forEach(summary => {
            if (summary.conflicts) {
              summary.conflicts.forEach(conflict => {
                logger.error(`DHIS2 Conflict: ${conflict.object} - ${conflict.value}`);
              });
            }
          });
        }
      } else {
        logger.error('Failed to post event to DHIS2:', error.message);
      }
      throw error;
    }
  }

  /**
   * Check if event already exists
   * @param {string} eventId - Event ID to check
   */
  async eventExists(eventId) {
    try {
      const response = await this.client.get(`/api/tracker/events/${eventId}`);
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      logger.error('Error checking event existence:', error.message);
      throw error;
    }
  }

  /**
   * Get program metadata
   * @param {string} programId - Program ID
   */
  async getProgramMetadata(programId) {
    try {
      const response = await this.client.get(`/api/programs/${programId}`, {
        params: {
          fields: 'id,name,programTrackedEntityAttributes,programStages'
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to get program metadata:', error.message);
      throw error;
    }
  }
}

module.exports = DHIS2Service;
