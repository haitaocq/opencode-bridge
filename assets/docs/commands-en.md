# Command Reference

## Feishu Commands

### Basic Commands

| Command | Description |
|---------|-------------|
| `/help` | View help |
| `/panel` | Open control panel (model, role, effort status, stop, undo) |
| `/status` | View current group binding status |

### Model & Agent

| Command | Description |
|---------|-------------|
| `/model` | View current model |
| `/model <provider:model>` | Switch model (supports `provider/model` format) |
| `/effort` | View current session reasoning effort and available levels |
| `/effort <level>` | Set session default effort (`none/minimal/low/medium/high/max/xhigh`) |
| `/effort default` | Clear session effort, return to model default |
| `/fast` `/balanced` `/deep` | Effort shortcuts (map to `low/high/xhigh`) |
| `/agent` | View current Agent |
| `/agent <name>` | Switch Agent |
| `/agent off` | Disable Agent, return to default |
| `/role create <spec>` | Create custom role in slash form |
| `创建角色 名称=...; 描述=...; 类型=...; 工具=...` | Create custom role in natural language |

### Session Management

| Command | Description |
|---------|-------------|
| `/stop` | Interrupt current session execution |
| `/undo` | Undo last interaction (OpenCode + Feishu sync) |
| `/compact` | Compress current session context |
| `/sessions` | List current project sessions |
| `/sessions all` | List all sessions from all projects |
| `/session new` | Start new topic (reset context, use default project) |
| `/session new <path or alias>` | Create new session in specified project/directory |
| `/session new --name <name>` | Name session during creation |
| `/session <sessionId>` | Bind existing OpenCode session |
| `/rename <new name>` | Rename current session |
| `/clear` | Equivalent to `/session new` |
| `/clear free session` | Trigger cleanup scan |
| `/clear free session <sessionId>` | Delete specified session |

### Project & Directory

| Command | Description |
|---------|-------------|
| `/project list` | List available projects (aliases + history directories) |
| `/project default` | View current group default project |
| `/project default set <path or alias>` | Set default working project for current group |
| `/project default clear` | Clear current group default project |

### File & Shell

| Command | Description |
|---------|-------------|
| `/send <absolute path>` | Send specified file to current group |
| `!<shell command>` | Passthrough whitelisted shell command (e.g., `!ls`, `!pwd`, `!git status`) |

### Group Management

| Command | Description |
|---------|-------------|
| `/create_chat` / `/建群` | Show group creation card in private chat |
| `/restart opencode` | Restart local OpenCode process (loopback only) |

### Cron Management

| Command | Description |
|---------|-------------|
| `/cron list` | List all runtime Cron tasks |
| `/cron add <spec>` | Add new Cron task |
| `/cron remove <jobId>` | Remove Cron task |
| `/cron pause <jobId>` | Pause Cron task |
| `/cron resume <jobId>` | Resume Cron task |

### Namespace Commands

| Command | Description |
|---------|-------------|
| `//<command>` | Passthrough namespace slash command (e.g., `//superpowers:brainstorming`) |
| `/commands` | Generate and send latest command list file |

---

## Discord Commands

Use `///` prefix to avoid conflict with native Slash commands.

### Session Management

| Command | Description |
|---------|-------------|
| `///session` | View bound OpenCode session |
| `///new [name] [--dir path/alias]` | Create and bind new session |
| `///new-channel [name] [--dir path/alias]` | Create new channel and bind session |
| `///bind <sessionId>` | Bind existing session |
| `///unbind` | Unbind current channel session |
| `///rename <new name>` | Rename current session |
| `///sessions` | View recent bindable sessions |
| `///undo` | Undo last round |
| `///compact` / `///compat` | Compress context |
| `///clear` | Delete and unbind current channel session |

### Model & Effort

| Command | Description |
|---------|-------------|
| `///effort` | View current effort |
| `///effort <level>` | Set session default effort |
| `///effort default` | Clear session effort |

### Project & File

| Command | Description |
|---------|-------------|
| `///workdir` | View current working directory |
| `///workdir <path/alias>` | Set working directory |
| `///workdir clear` | Clear working directory |
| `///send <absolute path>` | Send whitelisted file to current channel |
| `发送文件 <absolute path>` | Chinese natural language trigger for file sending |

### Control Panel

| Command | Description |
|---------|-------------|
| `///create_chat` | Open dropdown session control panel |
| `///create_chat model <page>` | Open model selection panel |
| `///create_chat session` / `agent` / `effort` | Open category panels |
| `///restart opencode` | Restart local OpenCode process |

### Cron Management

| Command | Description |
|---------|-------------|
| `///cron ...` | Manage runtime Cron tasks |

---

## WeCom Commands

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

## Telegram Commands

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

## QQ Commands

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

## Notes

### Compatibility Commands

The following compatibility commands are preserved: `/session`, `/new`, `/new-session`, `/clear`.

### Discord Specifics

- `///create_chat` uses Discord dropdown menus and modals for session control
- `///clear` in session channels (topic contains `oc-session:`) will attempt to delete the channel; if permission denied, only unbind
- `!` passthrough only supports whitelisted commands; interactive editors like `vi`/`vim`/`nano` are not supported

### WeCom Specifics

- WeCom doesn't support rich text cards, uses plain text interaction
- File sending is limited by WeCom API restrictions
- Recommend testing in test groups first

### Effort Override

- Single temporary override: use `#low` / `#high` / `#max` / `#xhigh` at message start (only for current message)
- Effort priority: `#temp override` > `///effort session default` > `model default`

### List Format

- `///sessions` list columns: `Workspace Directory | SessionID | OpenCode Session Name | Binding Details | Current Status`
- `///create_chat` dropdown labels: `Workspace / Session Short ID / Description`, grouped by workspace