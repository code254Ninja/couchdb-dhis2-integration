#!/bin/bash

# CouchDB to DHIS2 Integration Service Startup Script

echo "=== CouchDB to DHIS2 Integration Service ==="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting integration service..."
echo "Press Ctrl+C to stop"
echo ""

# Start the service
npm start
