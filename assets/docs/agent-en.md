# Agent (Role) Usage Guide

This document describes how to use and configure Agents (Roles) in OpenCode Bridge.

---

## 1. View and Switch Agent

### Web Panel (Recommended)

Use `/panel` to visually switch roles - takes effect immediately in current group.

### Command Line

| Command | Description |
|---------|-------------|
| `/agent` | View current Agent |
| `/agent <name>` | Switch to specified Agent |
| `/agent off` | Return to default Agent |

---

## 2. Custom Agent Creation

### Natural Language Format

```text
创建角色 名称=Travel Assistant; 描述=Expert at travel planning; 类型=primary; 工具=webfetch; 提示词=Ask budget and time first, then provide three options
```

### Slash Command Format

```text
/role create name=Code Reviewer; 描述=Focus on maintainability and security; 类型=subagent; 工具=read,grep; 提示词=List risks first, then give minimal change suggestions
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `名称` / `name` | Yes | Agent name |
| `描述` / `description` | No | Agent description |
| `类型` / `type` | No | `primary` or `subagent` |
| `工具` / `tools` | No | Comma-separated tool list |
| `提示词` / `prompt` | No | Custom instructions |

---

## 3. Agent Types

### Primary Agent

- Main agent for the conversation
- Has full access to tools
- Can delegate to subagents

### Subagent

- Specialized assistant
- Limited tool access
- Works under primary agent supervision

---

## 4. Configuration Reminder

If `/panel` does not immediately show the new role after configuration:

1. Restart OpenCode service
2. Or wait for configuration to take effect

---

## 5. Built-in Agents

OpenCode comes with default agents:

- **general**: General-purpose assistant
- **companion**: Conversational companion

You can switch between these or create custom agents.