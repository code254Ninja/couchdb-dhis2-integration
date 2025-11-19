# CouchDB to DHIS2 Tracker Integration

This service syncs death review reports from CouchDB (Medic Mobile) to DHIS2 Tracker in real-time.

## Features

- Monitors CouchDB for new death_review form submissions
- Automatically maps and pushes data to DHIS2 Tracker API
- Maintains sync state to avoid duplicate submissions
- Comprehensive error handling and logging
- Configurable via environment variables

## Prerequisites

- Node.js 14+ installed
- Access to CouchDB instance
- Access to DHIS2 Tracker instance with valid credentials

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials and endpoints

## Configuration

Update the field mapping in `src/config/field-mapping.js` to match your DHIS2 data elements.

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Field Mapping

The service maps death_review fields to DHIS2 data elements. Review and update mappings in:
- `src/config/field-mapping.js`

## Logs

Logs are written to:
- Console (stdout)
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs

## How It Works

1. Service connects to CouchDB and listens for changes
2. Filters for `death_review` form submissions
3. Transforms data to DHIS2 tracker event format
4. Posts to DHIS2 Tracker API
5. Tracks synced documents to prevent duplicates
6. Logs all operations for monitoring
