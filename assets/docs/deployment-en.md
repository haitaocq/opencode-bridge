# Deployment and Operations

This document details OpenCode Bridge deployment, upgrade, and operations methods.

---

## 1. Requirements

- **Node.js**: >= 18.0.0
- **OS**: Linux / macOS / Windows
- **OpenCode**: Must be installed and running

---

## 2. Deployment Commands

### Available Commands After Node.js Installation

| Goal | Command | Description |
|------|---------|-------------|
| One-click Deploy | `node scripts/deploy.mjs deploy` | Clean install, then install dependencies and build |
| One-click Upgrade | `node scripts/deploy.mjs upgrade` | Cleanup first, then pull and redeploy |
| Install OpenCode | `node scripts/deploy.mjs opencode-install` | Execute `npm i -g opencode-ai` |
| Check OpenCode | `node scripts/deploy.mjs opencode-check` | Check command and port listening |
| Start OpenCode | `node scripts/deploy.mjs opencode-start` | Execute `opencode` in foreground |
| First-time Guide | `node scripts/deploy.mjs guide` | Integrated install/deploy/guide flow |
| Management Menu | `npm run manage:bridge` | Interactive menu (default entry) |
| Start Background | `npm run start` | Start in background (auto-detect/build) |
| Stop Background | `node scripts/stop.mjs` | Stop background process by PID |

---

## 3. Web Configuration Panel

### Access Address

After service startup, access via browser:

```
http://localhost:4098
```

### Panel Features

| Feature | Description |
|---------|-------------|
| Config Management | Real-time modification of Feishu, Discord, WeCom, OpenCode configs |
| Cron Management | Create, enable/disable, delete scheduled tasks |
| Service Status | View uptime, version, database path |
| Model List | Get OpenCode available models |
| Service Control | Remote restart service |
| Platform Status | View connection status of each platform |

### Access Password

- Set on first access in Web panel
- Stored in SQLite database
- Can be changed in Web panel

---

## 4. Configuration Storage

### SQLite Database

Configuration parameters are stored in SQLite database:

- **Database Path**: `data/config.db`
- **First Migration**: Auto-migrate from `.env` on startup
- **Backup Location**: Original `.env` backed up as `.env.backup`

### Configuration Modification Methods

| Method | Description |
|--------|-------------|
| Web Panel | Access `http://localhost:4098` for visual modification |
| SQLite Tool | Directly edit `data/config.db` database |
| Config File | Configure in `.env` before first startup (auto-migrates) |

---

## 5. systemd Resident Running (Linux)

### Install Service

Install via management menu:

```bash
npm run manage:bridge
# Select "Install and start systemd service"
```

### Manual Configuration

Create service file `/etc/systemd/system/opencode-bridge.service`:

```ini
[Unit]
Description=OpenCode Bridge Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/opencode-bridge
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable opencode-bridge
sudo systemctl start opencode-bridge
```

### Log Locations

- Standard output: `logs/service.log`
- Error output: `logs/service.err`

---

## 6. npm CLI Installation

Suitable for local resident running scenarios:

```bash
# Global install
npm install -g opencode-bridge

# Start service
opencode-bridge

# Specify config directory
opencode-bridge --config-dir ~/.config/opencode-bridge
```

### Config Directory Priority

1. `.env` in current working directory
2. `~/.config/opencode-bridge/.env`
3. Directory specified by `--config-dir`

---

## 7. Platform Configuration

### Feishu Configuration

See [Feishu Config Guide](feishu-config-en.md).

### Discord Configuration

See [Discord Config Guide](discord-config-en.md).

### WeCom Configuration

See [WeCom Config Guide](wecom-config-en.md).

---

## 8. Reliability Configuration

See [Reliability Guide](reliability-en.md).

---

## 9. Troubleshooting

See [Troubleshooting Guide](troubleshooting-en.md).

### Common Issues

| Issue | Solution |
|-------|----------|
| Service won't start | Check port usage, view `logs/service.err` |
| Web panel inaccessible | Check firewall, confirm service started |
| Platform not responding | Check platform config, view service logs |
| OpenCode connection failed | Check `OPENCODE_HOST` and `OPENCODE_PORT` config |

---

## 10. Upgrade Guide

### Source Deployment Upgrade

```bash
# Method 1: Use upgrade script
node scripts/deploy.mjs upgrade

# Method 2: Manual upgrade
git pull origin main
npm install
npm run build
node scripts/stop.mjs
npm run start
```

### npm Installation Upgrade

```bash
npm update -g opencode-bridge
```

---

## 11. Log Management

### Log Files

| File | Description |
|------|-------------|
| `logs/service.log` | Service standard output |
| `logs/service.err` | Service error output |
| `logs/bridge.pid` | Background process PID |
| `logs/reliability-audit.jsonl` | Reliability audit log |

### Log Rotation

Recommended to configure logrotate:

```conf
# /etc/logrotate.d/opencode-bridge
/path/to/opencode-bridge/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

---

## 12. Backup and Recovery

### Backup

```bash
# Backup data directory
tar -czvf opencode-bridge-backup.tar.gz data/

# Backup config
cp data/config.db data/config.db.backup
```

### Recovery

```bash
# Recover data directory
tar -xzvf opencode-bridge-backup.tar.gz

# Recover config
cp data/config.db.backup data/config.db
```