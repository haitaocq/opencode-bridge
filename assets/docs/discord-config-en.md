# Discord Configuration Guide

This document explains how to configure Discord bot to connect to OpenCode Bridge.

---

## 1. Prerequisites

- OpenCode Bridge service deployed
- OpenCode installed and running
- Discord account

---

## 2. Create Discord Application

### Step 1: Create Application

1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" to create a new application
3. Fill in application name, click "Create"

### Step 2: Create Bot

1. In application page, select "Bot" tab
2. Click "Add Bot" to create bot
3. In "Token" section, click "Copy" to copy Bot Token

### Step 3: Enable Intents

In the Bot tab, enable the following Intents:

- **Presence Intent**: Required for presence tracking
- **Server Members Intent**: Required for member events
- **Message Content Intent**: **Required** for reading message content

---

## 3. Bridge Configuration

### Web Panel Configuration

In the Web configuration panel (`http://localhost:4098`):

1. Go to "Platform Access" → "Discord" configuration
2. Set "Enable Discord Adapter" to `true`
3. Fill in Discord Bot Token
4. Fill in Discord Client ID (optional, for advanced features)
5. Save configuration

### Configuration Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `DISCORD_ENABLED` | No | `false` | Enable Discord adapter |
| `DISCORD_TOKEN` | Yes | - | Discord Bot Token |
| `DISCORD_CLIENT_ID` | No | - | Discord application Client ID |
| `DISCORD_SHOW_THINKING_CHAIN` | No | - | Show AI thinking chain |
| `DISCORD_SHOW_TOOL_CHAIN` | No | - | Show tool call chain |

---

## 4. Invite Bot to Server

### Generate Invite URL

1. In application page, select "OAuth2" → "URL Generator"
2. In "SCOPES" select "bot"
3. In "BOT PERMISSIONS" select:
   - Send Messages
   - Read Message History
   - Embed Links
   - Attach Files
   - Add Reactions
   - Use Slash Commands (optional)

### Invite Bot

1. Copy generated URL
2. Open in browser
3. Select server to invite bot
4. Click "Authorize"

---

## 5. Usage

### Private Chat

Send messages directly to the bot.

### Group Chat

- @mention the bot, then send message
- Or use `/` commands

### Available Commands

| Command | Description |
|---------|-------------|
| `///session` | View bound session |
| `///new` | Create and bind new session |
| `///bind <sessionId>` | Bind existing session |
| `///undo` | Undo last round |
| `///compact` | Compress context |
| `///cron ...` | Manage Cron tasks |

---

## 6. Troubleshooting

### Bot Not Responding

1. Check `DISCORD_ENABLED` is `true`
2. Check `DISCORD_TOKEN` is correct
3. Check bot is online (shows online status in Discord)
4. View service logs for errors

### Commands Not Working

1. Ensure Message Content Intent is enabled
2. Check bot has Read Message History permission
3. Confirm command format is correct

### Message Send Failed

1. Check bot permissions are sufficient
2. Check channel permissions allow bot to send messages
3. Check network connection

---

## 7. Notes

- Discord adapter supports text messages and component interaction
- Does not support rich text cards (uses Embeds and components instead)
- File sending limited by Discord API (8MB standard, 50MB Nitro)
- Recommend testing in test channel first
- Message Content Intent is required for reading message content