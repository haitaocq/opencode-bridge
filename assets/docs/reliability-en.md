# Reliability Guide

This document details OpenCode Bridge's reliability mechanisms including heartbeat monitoring, Cron tasks, and crash rescue.

---

## 1. Default Behavior

Starting the bridge service automatically initializes the reliability lifecycle:

- **Heartbeat Engine**: Periodic OpenCode health probing
- **Cron Scheduler**: Scheduled task management
- **Rescue Orchestrator**: Auto-repair OpenCode failures

### Built-in Cron Tasks

| Task Name | Schedule | Description |
|-----------|----------|-------------|
| `watchdog-probe` | Every 30 seconds | OpenCode health probe |
| `process-consistency-check` | Every 60 seconds | Process consistency check |
| `stale-cleanup` | Every 5 minutes | Cleanup expired resources |
| `budget-reset` | Daily at 0:00 | Reset rescue budget |

### Proactive Heartbeat

Disabled by default (`RELIABILITY_PROACTIVE_HEARTBEAT_ENABLED=false`).

When enabled, triggered by Bridge timer, independent of platform inbound messages.

---

## 2. Runtime Cron Dynamic Management

### Management Entry Points

| Entry | Format | Description |
|-------|--------|-------------|
| HTTP API | `/cron/list|add|update|remove` | Manage via REST API |
| Feishu | `/cron ...` | Manage via command in Feishu |
| Discord | `///cron ...` | Manage via command in Discord |
| Web Panel | `http://localhost:4098` | Visual management in browser |

### Default Behavior

Cron tasks bind to "the chat window that created it + the OpenCode session bound at that time":

1. Execution prioritizes the original OpenCode session
2. Results are pushed back to the original chat window
3. If original window invalid, forwarding depends on configuration

### Natural Language Parsing

Support natural language Cron creation:

```text
/cron add a scheduled task to send me an AI briefing every morning at 8
///cron generate AI briefing, remember to send on weekdays
/cron pause task <jobId>
```

### API Examples

```bash
# List tasks
curl http://127.0.0.1:4097/cron/list

# Add task
curl -X POST http://127.0.0.1:4097/cron/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "daily-check",
    "schedule": { "kind": "cron", "expr": "0 * * * * *" },
    "payload": {
      "kind": "systemEvent",
      "text": "Execute routine check",
      "sessionId": "ses_xxx",
      "delivery": {
        "platform": "feishu",
        "conversationId": "oc_xxx"
      }
    },
    "enabled": true
  }'

# Update task (disable)
curl -X POST http://127.0.0.1:4097/cron/update \
  -H "Content-Type: application/json" \
  -d '{ "id": "<job-id>", "enabled": false }'

# Delete task
curl -X POST http://127.0.0.1:4097/cron/remove \
  -H "Content-Type: application/json" \
  -d '{ "id": "<job-id>" }'
```

### Authentication

If `RELIABILITY_CRON_API_TOKEN` is configured, requests must include:

```bash
-H "Authorization: Bearer <token>"
```

---

## 3. Minimum Configuration

```env
# OpenCode connection (local recommended for auto-rescue)
OPENCODE_HOST=localhost
OPENCODE_PORT=4096

# Cron basic switches
RELIABILITY_CRON_ENABLED=true
RELIABILITY_CRON_API_ENABLED=true
RELIABILITY_CRON_API_HOST=127.0.0.1
RELIABILITY_CRON_API_PORT=4097

# Optional: Cron API Token
# RELIABILITY_CRON_API_TOKEN=your-token

# Optional: Task persistence file
# RELIABILITY_CRON_JOBS_FILE=/absolute/path/jobs.json

# Optional: Orphan task auto-cleanup
# RELIABILITY_CRON_ORPHAN_AUTO_CLEANUP=false

# Optional: Forward to private chat
# RELIABILITY_CRON_FORWARD_TO_PRIVATE=false

# Proactive heartbeat (disabled by default)
RELIABILITY_PROACTIVE_HEARTBEAT_ENABLED=false
RELIABILITY_INBOUND_HEARTBEAT_ENABLED=false

# Reliability strategy
RELIABILITY_LOOPBACK_ONLY=true
RELIABILITY_HEARTBEAT_INTERVAL_MS=1800000
RELIABILITY_FAILURE_THRESHOLD=3
RELIABILITY_WINDOW_MS=90000
RELIABILITY_COOLDOWN_MS=300000
RELIABILITY_REPAIR_BUDGET=3

# Crash rescue config file
OPENCODE_CONFIG_FILE=./opencode.json
```

---

## 4. Heartbeat Usage Guide

### Enable Heartbeat

Set `RELIABILITY_PROACTIVE_HEARTBEAT_ENABLED=true` and restart service.

### Heartbeat Flow

1. Bridge timer triggers per `RELIABILITY_HEARTBEAT_INTERVAL_MS`
2. Send heartbeat prompt to Agent Session
3. Agent reads `HEARTBEAT.md` and executes checks
4. Check results:
   - No issues: Reply `HEARTBEAT_OK`
   - Issues found: Return alert text (can push to `RELIABILITY_HEARTBEAT_ALERT_CHATS`)

### HEARTBEAT.md Format

```markdown
- [ ] failure_type: Description  # Enabled
- [x] failure_type: Description  # Disabled
```

### State Files

- Heartbeat session state: `memory/heartbeat-session.json`
- Audit log: `logs/reliability-audit.jsonl`

---

## 5. Execution Flows

### Cron Execution Flow

```
Bridge Start
    │
    ▼
Load built-in Cron tasks
    │
    ▼
Load persisted jobs.json
    │
    ▼
Register to CronScheduler
    │
    ▼
Trigger per cron expr
    │
    ▼
Check original chat window and session binding
    │
    ├─ Binding valid → Execute in original OpenCode session → Push results to original window
    │
    ├─ Original window invalid, forwarding allowed → Execute and forward to private chat/backup
    │
    └─ Original window invalid, forwarding disabled → Skip or cleanup orphan task
```

### Heartbeat Execution Flow

```
Bridge timer every N minutes
    │
    ▼
Send heartbeat prompt to Agent Session
    │
    ▼
Agent reads HEARTBEAT.md
    │
    ▼
Check results
    │
    ├─ No issues → Reply HEARTBEAT_OK → Bridge logs silently
    │
    └─ Issues found → Reply alert content → Bridge logs and can push user alerts
```

---

## 6. Auto-Rescue Trigger Conditions

### Trigger Conditions

Health probe continuous failures, and:

- Consecutive failure count `>= RELIABILITY_FAILURE_THRESHOLD`
- Failure window duration `>= RELIABILITY_WINDOW_MS`

### Guard Conditions

- Target host is loopback (`localhost/127.0.0.1/::1`)
- Repair budget not exhausted
- Cooldown window passed since last repair

### Rescue Flow

```
Rescue triggered
    │
    ▼
Lock and single-instance check
    │
    ▼
Environment diagnosis
    │
    ▼
Config backup and two-level rollback
    │
    ▼
Start OpenCode
    │
    ▼
Health re-check
    │
    ▼
Auto-send recovery context
```

---

## 7. Artifacts and Audit Locations

| File | Description |
|------|-------------|
| `memory/heartbeat-session.json` | Heartbeat session state |
| `logs/reliability-audit.jsonl` | Reliability audit log |
| `<OPENCODE_CONFIG_FILE>.bak.<timestamp>.<sha256>` | Config backup |

---

## 8. Orphan Cron and Fallback Strategy

### RELIABILITY_CRON_ORPHAN_AUTO_CLEANUP=false (default)

- No automatic orphan Cron scan at startup
- No automatic deletion when group dismiss/channel delete
- Task execution skips if binding invalid, logs recorded

### RELIABILITY_CRON_ORPHAN_AUTO_CLEANUP=true

- Scan and delete orphan Crons missing original window binding or session at startup
- Delete Crons bound to group when group dismiss or channel delete
- `stale-cleanup` periodic task continues scanning orphan Crons

### RELIABILITY_CRON_FORWARD_TO_PRIVATE=true

When original chat window invalid but original session still executable and not bound to other active windows:

- Can forward results to private chat/backup window
- Fallback target priority: task explicit fallback > env fallback id > same platform creator private chat

---

## 9. Common Self-Check Commands

```bash
# Check OpenCode local environment
node scripts/deploy.mjs opencode-check

# Verify reliability startup/cleanup flow
npm test -- tests/reliability-bootstrap.test.ts

# Verify rescue end-to-end scenario
npm test -- tests/reliability-rescue.e2e.test.ts
```

---

## 10. Platform-Specific Notes

### Feishu

- Full message card interaction support
- Permission confirmation, question answering support
- File sending supports images and documents

### Discord

- Text messages and component interaction
- Embeds and buttons support
- File sending limited by Discord API

### WeCom

- Plain text message interaction only
- No rich text cards
- File sending limited by WeCom API