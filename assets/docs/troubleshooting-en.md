# Troubleshooting Guide

This document provides solutions for common issues with OpenCode Bridge.

---

## 1. Feishu Issues

| Symptom | Priority Check |
|---------|----------------|
| No response after sending Feishu message | Check Feishu permissions; verify [Feishu Backend Configuration](feishu-config.md) |
| No response after clicking permission card | Check logs for permission response failure; confirm response is `once/always/reject` |
| Permission/question card fails to send to group | Check `sessionId -> chatId` mapping exists |
| Card update fails | Check message type matches; whether fallback to resend card |

---

## 2. Discord Issues

| Symptom | Priority Check |
|---------|----------------|
| No response after sending Discord message | Check `DISCORD_ENABLED` is `true`; check `DISCORD_TOKEN` is correct |
| Bot shows offline | Check Bot Token is valid; check network connection |
| Commands not working | Ensure Message Content Intent is enabled; check bot permissions |
| File sending failed | Check file size doesn't exceed Discord limits (8MB/50MB) |

---

## 3. WeCom Issues

| Symptom | Priority Check |
|---------|----------------|
| No response after sending WeCom message | Check `WECOM_ENABLED` is `true`; check `WECOM_BOT_ID` and `WECOM_SECRET` |
| Message receive URL misconfigured | Confirm Webhook URL is configured correctly |
| Insufficient application permissions | Check WeCom application permission settings |

---

## 4. Telegram Issues

| Symptom | Priority Check |
|---------|----------------|
| No response after sending message | Check `TELEGRAM_ENABLED` is `true`; check `TELEGRAM_BOT_TOKEN` |
| Bot shows offline | Check Bot Token is valid; check network connection |

---

## 5. QQ Issues

| Symptom | Priority Check |
|---------|----------------|
| No response after sending message | Check `QQ_ENABLED` is `true`; check OneBot connection |
| OneBot connection failed | Check `QQ_ONEBOT_HTTP_URL` and `QQ_ONEBOT_WS_URL` |

---

## 6. OpenCode Issues

| Symptom | Priority Check |
|---------|----------------|
| `/compact` fails | Check OpenCode available models; try `/model <provider:model>` first |
| `!ls` shell command fails | Check current session Agent; try `/agent general` first |
| OpenCode connection fails | Check `OPENCODE_HOST` and `OPENCODE_PORT` configuration |
| Authentication fails (401/403) | Check `OPENCODE_SERVER_USERNAME` and `OPENCODE_SERVER_PASSWORD` |
| OpenCode > v1.2.15 no response via Feishu | Check `~/.config/opencode/opencode.json` for `"default_agent": "companion"` and remove it |

---

## 7. Reliability Issues

| Symptom | Priority Check |
|---------|----------------|
| Heartbeat doesn't seem to execute | Check `HEARTBEAT.md` has items marked as `- [ ]`; check `memory/heartbeat-state.json` `lastRunAt` |
| Auto-rescue doesn't trigger | Check `OPENCODE_HOST` is loopback; `RELIABILITY_LOOPBACK_ONLY` is enabled; failure count/window reached threshold |
| Auto-rescue rejected (manual) | Check `logs/reliability-audit.jsonl` `reason` field (common: `loopback_only_blocked`, `repair_budget_exhausted`) |
| Backup config not found | Check `logs/reliability-audit.jsonl` `backupPath`; backup files named `.bak.<timestamp>.<sha256>` |
| Cron task doesn't execute | Check `RELIABILITY_CRON_ENABLED` is `true`; check Cron task status |

---

## 8. Web Panel Issues

| Symptom | Priority Check |
|---------|----------------|
| Web panel inaccessible | Check `ADMIN_PORT` configuration; check firewall; check service is started |
| Config changes not taking effect | Check if sensitive config (needs restart); view service logs |
| Password error | Check Web panel password set correctly |
| Config lost | Check `data/config.db` exists; check for backup files |

---

## 9. Session Issues

| Symptom | Priority Check |
|---------|----------------|
| Private chat sends multiple guide messages on first chat | This is expected first-time flow (create group card + `/help` + `/panel`); subsequent chats work normally |
| `/send <path>` reports "file not found" | Confirm path is correct and absolute; Windows paths can use `\` or `/` |
| `/send` reports "sensitive file rejected" | Built-in security blacklist blocks .env, keys, etc. |
| File send fails with size limit | Feishu image limit 10MB, file limit 30MB; compress and retry |
| Session binding fails | Check `ENABLE_MANUAL_SESSION_BIND` configuration; check session ID is correct |

---

## 10. Background Service Issues

| Symptom | Priority Check |
|---------|----------------|
| Background mode can't stop | Check `logs/bridge.pid` is residual; use `node scripts/stop.mjs` to cleanup |
| Service fails to start | Check port in use; view `logs/service.err` |
| Log files too large | Periodically clean `logs/` directory; configure log rotation |

---

## 11. General Troubleshooting Steps

1. **View service logs**: `logs/service.log` and `logs/service.err`
2. **Check configuration**: Via Web panel or `data/config.db`
3. **Restart service**: Via Web panel or `node scripts/stop.mjs && npm run start`
4. **Check network**: Ensure server can access platform APIs
5. **Check permissions**: Ensure application/bot has sufficient permissions