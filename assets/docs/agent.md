# Agent（角色）使用指南

本文档说明如何在 OpenCode Bridge 中使用和配置 Agent（角色）。

---

## 1. 查看与切换 Agent

### Web 面板（推荐）

使用 `/panel` 可视化切换角色，当前群即时生效。

### 命令行方式

| 命令 | 说明 |
|------|------|
| `/agent` | 查看当前 Agent |
| `/agent <name>` | 切换到指定 Agent |
| `/agent off` | 回到默认 Agent |

---

## 2. 自定义 Agent 创建

### 自然语言格式

```text
创建角色 名称=旅行助手; 描述=擅长制定旅行计划; 类型=主; 工具=webfetch; 提示词=先询问预算和时间，再给三套方案
```

### 斜杠命令格式

```text
/role create 名称=代码审查员; 描述=关注可维护性和安全; 类型=子; 工具=read,grep; 提示词=先列风险，再给最小改动建议
```

### 参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `名称` / `name` | 是 | Agent 名称 |
| `描述` / `description` | 否 | Agent 描述 |
| `类型` / `type` | 否 | `主`/`子` 或 `primary`/`subagent` |
| `工具` / `tools` | 否 | 逗号分隔的工具列表 |
| `提示词` / `prompt` | 否 | 自定义指令 |

---

## 3. Agent 类型

### 主 Agent (Primary)

- 对话的主要代理
- 拥有完整的工具访问权限
- 可以委托给子 Agent

### 子 Agent (Subagent)

- 专业助手
- 有限的工具访问权限
- 在主 Agent 监督下工作

---

## 4. 配置提醒

如果 `/panel` 未立即显示新角色：

1. 重启 OpenCode 服务
2. 或等待配置生效

---

## 5. 内置 Agent

OpenCode 自带默认 Agent：

- **general**：通用助手
- **companion**：对话伴侣

可以在这些之间切换，或创建自定义 Agent。