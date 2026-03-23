# Feishu Backend Configuration Guide

This document describes how to configure the Feishu application for OpenCode Bridge.

---

## 1. Event Subscriptions

Recommended to use long connection mode (WebSocket events).

### Required Events

| Event | Required | Purpose |
|-------|----------|---------|
| `im.message.receive_v1` | Yes | Receive group/private chat messages |
| `im.message.recalled_v1` | Yes | User recall triggers `/undo` rollback |
| `im.chat.member.user.deleted_v1` | Yes | Member leave triggers lifecycle cleanup |
| `im.chat.disbanded_v1` | Yes | Group dismiss triggers session mapping cleanup |
| `card.action.trigger` | Yes | Handle control panel, permission, question callbacks |

### Optional Events

| Event | Required | Purpose |
|-------|----------|---------|
| `im.message.message_read_v1` | No | Read receipt compatibility |

---

## 2. Application Permissions

### Permission Groups

| Capability Group | APIs Called | Purpose |
|------------------|-------------|---------|
| Message Read/Write (`im:message`) | `im:message.p2p_msg:readonly`, `im:message.group_at_msg:readonly`, `im:message.group_msg`, `im:message.reactions:read`, `im:message.reactions:write_only` | Send text/cards, streaming updates, recall messages |
| Group Management (`im:chat`) | `im:chat.members:read`, `im:chat.members:write_only` | Create groups, invite members, check members, cleanup invalid groups |
| Resource Download (`im:resource`) | `im.messageResource.get` | Download image/file attachments and forward to OpenCode |

### Batch Import Permission Configuration

Copy the following to `acc.json`, then import in Feishu Developer Backend → Permission Management → Batch Import/Export:

```json
{
  "scopes": {
    "tenant": [
      "im:message.p2p_msg:readonly",
      "im:chat",
      "im:chat.members:read",
      "im:chat.members:write_only",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.group_msg",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:resource"
    ],
    "user": []
  }
}
```

---

## 3. Configuration Steps

### Step 1: Create Feishu Application

1. Visit [Feishu Open Platform](https://open.feishu.cn/)
2. Create a new application
3. Record the App ID and App Secret

### Step 2: Configure Event Subscription

1. In application settings, find "Event Subscription"
2. Recommended to use "Long Connection" mode (WebSocket)
3. Add required events

### Step 3: Configure Permissions

1. Find "Permission Management" in application settings
2. Add required permissions
3. Or batch import using the JSON above

### Step 4: Configure Encryption

1. Find "Encryption" settings
2. Record the Encrypt Key and Verification Token
3. Configure in OpenCode Bridge

---

## 4. Bridge Configuration

Configure the following parameters in Web panel or `.env`:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `FEISHU_ENABLED` | Yes | Set to `true` to enable Feishu |
| `FEISHU_APP_ID` | Yes | Feishu application App ID |
| `FEISHU_APP_SECRET` | Yes | Feishu application App Secret |
| `FEISHU_ENCRYPT_KEY` | No | Feishu Encrypt Key |
| `FEISHU_VERIFICATION_TOKEN` | No | Feishu Verification Token |

---

## 5. Verification

After configuration, verify in Feishu:

1. Send a message to the bot in private chat
2. If configured correctly, the bot should respond
3. Test group chat by @mentioning the bot

---

## 6. Troubleshooting

### Bot Not Responding

1. Check `FEISHU_ENABLED` is `true`
2. Check App ID and App Secret are correct
3. Check event subscription is properly configured
4. Check permissions are granted

### Permission Denied

1. Check all required permissions are granted
2. Wait for permission changes to take effect (may take a few minutes)

### Card Actions Not Working

1. Check `card.action.trigger` event is subscribed
2. Check the card callback URL is accessible