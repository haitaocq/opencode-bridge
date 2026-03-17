# Agent (Role) Usage Guide

## 1) View and Switch

- Recommended to use `/panel` to visually switch roles (takes effect immediately in current group).
- Alternatively use commands: `/agent` (view current), `/agent <name>` (switch), `/agent off` (return to default).

## 2) Custom Agent

Supports creating and switching directly via natural language:

```text
创建角色 名称=旅行助手; 描述=擅长制定旅行计划; 类型=主; 工具=webfetch; 提示词=先询问预算和时间，再给三套方案
```

Also supports slash form:

```text
/role create 名称=代码审查员; 描述=关注可维护性和安全; 类型=子; 工具=read,grep; 提示词=先列风险，再给最小改动建议
```

**Type** supports `主/子` (or `primary/subagent`).

## 3) Configuring Agent (Reminder)

If `/panel` does not immediately show the new role after configuration, restart OpenCode.
