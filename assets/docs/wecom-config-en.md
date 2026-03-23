# WeCom Configuration Guide

This document explains how to configure WeCom (WeChat Work) bot to connect to OpenCode Bridge.

---

## 1. Prerequisites

- OpenCode Bridge service deployed
- OpenCode installed and running
- WeCom enterprise account

---

## 2. Create WeCom Application

### Step 1: Log in to Admin Backend

1. Log in to [WeCom Admin Backend](https://work.weixin.qq.com/)
2. Go to "Application Management"

### Step 2: Create Application

1. Click "Applications" → "Self-built"
2. Create new application or select existing one
3. Record the AgentId (Bot ID) and Secret

---

## 3. Bridge Configuration

### Web Panel Configuration

In the Web configuration panel (`http://localhost:4098`):

1. Go to "Platform Access" → "WeCom" configuration
2. Set "Enable WeCom Adapter" to `true`
3. Fill in WeCom Bot ID (AgentId)
4. Fill in WeCom Secret
5. Save configuration

### Configuration Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `WECOM_ENABLED` | No | `false` | Enable WeCom adapter |
| `WECOM_BOT_ID` | Yes | - | WeCom Bot ID (AgentId) |
| `WECOM_SECRET` | Yes | - | WeCom Secret |
| `WECOM_SHOW_THINKING_CHAIN` | No | - | Show AI thinking chain |
| `WECOM_SHOW_TOOL_CHAIN` | No | - | Show tool call chain |

---

## 4. Configure Message Reception

### Set API Receive Address

1. In application details page, find "Receive Message" configuration
2. Set API receive address to:
   ```
   http://your-server:your-port/wecom/webhook
   ```
3. Save configuration

---

## 5. Configure Permissions

In WeCom admin backend, ensure application has following permissions:

- Send messages to users/departments/tags
- Read user information
- Manage contacts (optional)

---

## 6. Usage

### Available Commands

| Command | Description |
|---------|-------------|
| `/help` | View help |
| `/panel` | Open control panel |
| `/model <provider:model>` | Switch model |
| `/agent <name>` | Switch Agent |
| `/session new` | Start new topic |
| `/undo` | Undo last interaction |
| `/compact` | Compress context |

---

## 7. Troubleshooting

### Bot Not Responding

1. Check `WECOM_ENABLED` is `true`
2. Check `WECOM_BOT_ID` and `WECOM_SECRET` are correct
3. Check message receive URL is configured correctly
4. View service logs for errors

### Message Send Failed

1. Check application permissions are sufficient
2. Check user/group ID is correct
3. Check network connection

---

## 8. Notes

- WeCom adapter currently supports text message interaction
- Does not support rich text cards (unlike Feishu)
- File sending is limited by WeCom API
- Recommend testing in test group first