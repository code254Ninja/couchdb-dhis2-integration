# Server Deployment Guide

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Node.js**: v14.x or higher
- **RAM**: Minimum 512MB (1GB recommended)
- **Network**: Access to both CouchDB and DHIS2 servers
- **User**: Non-root user with sudo privileges

### Required Access
- SSH access to your server
- CouchDB credentials and URL
- DHIS2 credentials and URL
- Port access to CouchDB (usually 443/10444) and DHIS2 (443)

---

## Deployment Steps

### 1. Connect to Your Server
```bash
ssh your-user@your-server-ip
```

### 2. Install Node.js (if not installed)
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Clone the Repository
```bash
# Create application directory
sudo mkdir -p /opt/couchdb-dhis2-integration
sudo chown $USER:$USER /opt/couchdb-dhis2-integration

# Clone from GitHub
cd /opt
git clone https://github.com/code254Ninja/couchdb-dhis2-integration.git
cd couchdb-dhis2-integration
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required Configuration:**
```env
# CouchDB Configuration
COUCHDB_URL=https://your-couchdb-server:10444
COUCHDB_USERNAME=your-couchdb-username
COUCHDB_PASSWORD=your-couchdb-password
COUCHDB_DB=medic

# DHIS2 Configuration
DHIS2_URL=https://histracker.health.go.ke
DHIS2_USERNAME=your-dhis2-username
DHIS2_PASSWORD=your-dhis2-password
DHIS2_PROGRAM=gsV6ZGGQSqK
DHIS2_PROGRAM_STAGE=qUBD0Wa5x0Z
DHIS2_ORG_UNIT=DiszpKrYNg8

# Network Configuration (if needed)
DHIS2_IP=38.242.215.143

# Logging
LOG_LEVEL=info
```

### 6. Test the Service
```bash
# Run in test mode (no actual sync)
node test-mode.js --existing 5 --no-watch

# If successful, try starting normally
npm start
```

Press `Ctrl+C` to stop, then continue to set up as a service.

---

## Running as a System Service (Recommended)

### Create Systemd Service
```bash
sudo nano /etc/systemd/system/couchdb-dhis2-integration.service
```

**Service Configuration:**
```ini
[Unit]
Description=CouchDB to DHIS2 Integration Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/opt/couchdb-dhis2-integration
ExecStart=/usr/bin/node /opt/couchdb-dhis2-integration/src/index.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/couchdb-dhis2-integration/stdout.log
StandardError=append:/var/log/couchdb-dhis2-integration/stderr.log

# Environment
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Important:** Replace `your-username` with your actual Linux username.

### Set Up Log Directory
```bash
sudo mkdir -p /var/log/couchdb-dhis2-integration
sudo chown $USER:$USER /var/log/couchdb-dhis2-integration
```

### Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable couchdb-dhis2-integration

# Start the service
sudo systemctl start couchdb-dhis2-integration

# Check status
sudo systemctl status couchdb-dhis2-integration
```

---

## Service Management Commands

```bash
# Start service
sudo systemctl start couchdb-dhis2-integration

# Stop service
sudo systemctl stop couchdb-dhis2-integration

# Restart service
sudo systemctl restart couchdb-dhis2-integration

# Check status
sudo systemctl status couchdb-dhis2-integration

# View logs (live)
sudo journalctl -u couchdb-dhis2-integration -f

# View application logs
tail -f /opt/couchdb-dhis2-integration/logs/combined.log
tail -f /opt/couchdb-dhis2-integration/logs/error.log
```

---

## Monitoring and Maintenance

### Check Service Health
```bash
# Service status
sudo systemctl is-active couchdb-dhis2-integration

# View recent logs
sudo journalctl -u couchdb-dhis2-integration --since "1 hour ago"

# Check sync state
cat /opt/couchdb-dhis2-integration/sync-state.json | jq '.'
```

### Log Rotation
Create log rotation config:
```bash
sudo nano /etc/logrotate.d/couchdb-dhis2-integration
```

```
/opt/couchdb-dhis2-integration/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0644 your-username your-username
}
```

### Updates and Maintenance
```bash
# Navigate to directory
cd /opt/couchdb-dhis2-integration

# Stop service
sudo systemctl stop couchdb-dhis2-integration

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install --production

# Restart service
sudo systemctl start couchdb-dhis2-integration

# Verify it's running
sudo systemctl status couchdb-dhis2-integration
```

---

## Firewall Configuration

If you have a firewall enabled, ensure outbound connections are allowed:

```bash
# Allow outbound HTTPS (port 443)
sudo ufw allow out 443/tcp

# Allow outbound to CouchDB port (if custom)
sudo ufw allow out 10444/tcp

# Check firewall status
sudo ufw status
```

---

## Troubleshooting

### Service Won't Start
```bash
# Check service status and logs
sudo systemctl status couchdb-dhis2-integration
sudo journalctl -u couchdb-dhis2-integration -n 50

# Check permissions
ls -la /opt/couchdb-dhis2-integration/.env
ls -la /opt/couchdb-dhis2-integration/logs/
```

### Connection Issues
```bash
# Test CouchDB connection
curl -k "https://$COUCHDB_USERNAME:$COUCHDB_PASSWORD@your-couchdb:10444/medic"

# Test DHIS2 connection
curl -k -u "$DHIS2_USERNAME:$DHIS2_PASSWORD" \
  "https://histracker.health.go.ke/api/system/info"

# Check DNS resolution
nslookup histracker.health.go.ke
ping -c 3 38.242.215.143
```

### Clear Sync State (Re-sync All)
```bash
# Stop service
sudo systemctl stop couchdb-dhis2-integration

# Remove sync state
rm /opt/couchdb-dhis2-integration/sync-state.json

# Start service (will backfill all documents)
sudo systemctl start couchdb-dhis2-integration
```

---

## Security Best Practices

1. **Protect .env file**
   ```bash
   chmod 600 /opt/couchdb-dhis2-integration/.env
   ```

2. **Use non-root user** - Never run as root

3. **Regular updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Update Node.js dependencies
   cd /opt/couchdb-dhis2-integration
   npm audit fix
   ```

4. **Monitor logs** - Set up log monitoring/alerting

5. **Backup sync-state.json** regularly

---

## Performance Tuning

For high-volume deployments:

1. **Increase Node.js memory** (if needed)
   ```ini
   # In systemd service file
   Environment=NODE_OPTIONS=--max-old-space-size=2048
   ```

2. **Adjust batch size** in `src/index.js` if processing many documents

3. **Monitor resource usage**
   ```bash
   # Check CPU and memory
   htop
   
   # Check service resource usage
   systemctl status couchdb-dhis2-integration
   ```

---

## Backup and Recovery

### Backup
```bash
# Backup sync state and logs
tar -czf couchdb-dhis2-backup-$(date +%Y%m%d).tar.gz \
  /opt/couchdb-dhis2-integration/sync-state.json \
  /opt/couchdb-dhis2-integration/logs/
```

### Recovery
```bash
# Restore sync state
tar -xzf couchdb-dhis2-backup-YYYYMMDD.tar.gz
cp sync-state.json /opt/couchdb-dhis2-integration/
sudo systemctl restart couchdb-dhis2-integration
```

---

## Contact and Support

For issues or questions:
- Check logs: `/opt/couchdb-dhis2-integration/logs/`
- Review documentation in GitHub repository
- Check DHIS2 events in tracker UI

**Repository**: https://github.com/code254Ninja/couchdb-dhis2-integration
