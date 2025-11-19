# Setup Guide

## Quick Start

1. **Configure environment variables**
   
   The `.env` file has been created with default values. Review and update if needed:
   ```bash
   nano .env
   ```

2. **Update DHIS2 field mappings**
   
   Edit `src/config/field-mapping.js` to map death_review fields to your DHIS2 data element IDs.
   
   **IMPORTANT**: The current mappings use example IDs. You must replace them with actual DHIS2 data element IDs from your instance.

3. **Get DHIS2 Data Element IDs**
   
   To find your data element IDs:
   ```bash
   # Login to DHIS2 and get program structure
   curl -u kihara:Kenya123@@ \
     'https://histracker.health.go.ke/api/programs/eBAyeGv0exc?fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name]]]' \
     | jq .
   ```

4. **Test the connection**
   
   Before starting the service, test connectivity:
   ```bash
   node -e "
   require('dotenv').config();
   const DHIS2Service = require('./src/services/dhis2');
   const dhis2 = new DHIS2Service({
     url: process.env.DHIS2_URL,
     username: process.env.DHIS2_USERNAME,
     password: process.env.DHIS2_PASSWORD
   });
   dhis2.initialize();
   dhis2.testConnection().then(() => console.log('✓ Connection successful'));
   "
   ```

5. **Start the service**
   ```bash
   ./start.sh
   ```
   
   Or run directly:
   ```bash
   npm start
   ```

## Configuration Options

### Environment Variables

- **COUCHDB_URL**: Your Medic Mobile instance URL
- **COUCHDB_USERNAME**: CouchDB username (default: medic)
- **COUCHDB_PASSWORD**: CouchDB password
- **COUCHDB_DATABASE**: Database name (default: medic)
- **DHIS2_URL**: DHIS2 instance URL
- **DHIS2_USERNAME**: DHIS2 username
- **DHIS2_PASSWORD**: DHIS2 password
- **DHIS2_PROGRAM**: DHIS2 program ID (default: eBAyeGv0exc)
- **DHIS2_ORG_UNIT**: DHIS2 organization unit ID (default: DiszpKrYNg8)
- **LOG_LEVEL**: Logging level (debug, info, warn, error)

### Field Mapping

Edit `src/config/field-mapping.js` to customize:

1. **mappings object**: Maps CouchDB field names to DHIS2 data element IDs
2. **transformToTrackerEvent()**: Custom transformation logic if needed

Example mapping:
```javascript
mappings: {
  'patient_name': 'ABC123XYZ',  // Replace with actual DHIS2 data element ID
  'patient_age_in_years': 'DEF456UVW',
  // ... add more mappings
}
```

## Backfilling Historical Data

To sync existing death_review reports, uncomment this line in `src/index.js`:

```javascript
// Around line 130
await service.backfillHistoricalData(100);
```

This will process up to 100 existing reports on startup.

## Monitoring

### Logs

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only
- Console output

### Sync State

The service maintains sync state in `sync-state.json`:
```json
{
  "lastSeq": "123-xyz",
  "syncedDocuments": {
    "doc-id-1": {
      "syncedAt": "2025-11-19T...",
      "dhis2EventId": "medic-doc-id-1"
    }
  },
  "lastSyncTime": "2025-11-19T..."
}
```

## Troubleshooting

### Connection Issues

**CouchDB connection failed**
- Verify URL, username, and password
- Check if SSL certificate validation is causing issues (set `COUCHDB_REJECT_UNAUTHORIZED=false` for self-signed certs)

**DHIS2 connection failed**
- Verify credentials and URL
- Check network connectivity
- Ensure DHIS2 instance is accessible

### Mapping Issues

**Missing data elements**
- Review `src/config/field-mapping.js`
- Ensure all referenced DHIS2 data element IDs exist in your program
- Check DHIS2 logs for validation errors

### Duplicate Prevention

The service tracks synced documents to prevent duplicates. To re-sync:
1. Stop the service
2. Delete or edit `sync-state.json`
3. Restart the service

## Advanced Usage

### Custom Transformations

Modify `transformToTrackerEvent()` in `src/config/field-mapping.js` for custom logic:

```javascript
transformToTrackerEvent(doc, config) {
  const fields = doc.fields || {};
  
  // Your custom transformation logic here
  
  return {
    program: config.program,
    orgUnit: config.orgUnit,
    eventDate: '...',
    dataValues: [...]
  };
}
```

### Running as a Service

To run as a system service (Linux):

1. Create systemd service file: `/etc/systemd/system/couchdb-dhis2.service`
```ini
[Unit]
Description=CouchDB to DHIS2 Integration Service
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/couchdb-dhis2-integration
ExecStart=/usr/bin/node src/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

2. Enable and start:
```bash
sudo systemctl enable couchdb-dhis2
sudo systemctl start couchdb-dhis2
sudo systemctl status couchdb-dhis2
```
