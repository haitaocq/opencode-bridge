# Deployment and Operations

## Available Commands After Node.js Installation

| Goal | Command | Description |
|---|---|---|
| One-click Deploy | `node scripts/deploy.mjs deploy` | Clean install by default, then install dependencies and build |
| One-click Update/Upgrade | `node scripts/deploy.mjs upgrade` | Clean upgrade by default: uninstall/cleanup first, then pull and redeploy |
| Install/Upgrade OpenCode | `node scripts/deploy.mjs opencode-install` | Execute `npm i -g opencode-ai` |
| Check OpenCode Environment | `node scripts/deploy.mjs opencode-check` | Check opencode command and port listening |
| Start OpenCode CLI | `node scripts/deploy.mjs opencode-start` | Auto-write `opencode.json` then execute `opencode` in foreground |
| First-time Guide | `node scripts/deploy.mjs guide` | Integrated flow for install/deploy/guide startup |
| Management Menu | `npm run manage:bridge` | Interactive menu (default entry) |
| Start Background | `npm run start` | Start in background (auto-detect/supplement build) |
| Stop Background | `node scripts/stop.mjs` | Stop background process by PID |

**Note**: The menu includes OpenCode installation/check/startup and first-time guide; deployment will additionally provide strong prompts for OpenCode installation and port check (non-blocking).

## Linux Resident (systemd)

The management menu provides the following operations:

- Install and start systemd service
- Stop and disable systemd service
- Uninstall systemd service
- View running status

Logs default to `logs/service.log` and `logs/service.err`.

## npm CLI Installation (More Suitable for Local Resident Operation)

```bash
npm install -g opencode-bridge
opencode-bridge
```

**Notes**:
- npm package mainly provides CLI distribution and version management convenience, does not replace OpenCode local service and Feishu/Discord configuration.
- Before running, still need to prepare `.env`, local `opencode serve`, and corresponding platform bot credentials.
- CLI defaults to reading `.env` from current working directory; if no `.env` in current directory, automatically falls back to `~/.config/opencode-bridge/.env`.
- You can also explicitly specify config directory: `opencode-bridge --config-dir /path/to/config`.
- If you prefer source code deployment, continuing to use `scripts/deploy.*` / `scripts/start.*` from the repository is perfectly fine.

## npm CLI Configuration

```bash
mkdir -p ~/.config/opencode-bridge

# If installed globally via npm:
cp "$(npm root -g)/opencode-bridge/.env.example" ~/.config/opencode-bridge/.env

# If running from source repository:
# cp .env.example ~/.config/opencode-bridge/.env

# Start directly with default config directory
opencode-bridge

# Or place independent .env in current directory
mkdir -p ~/opencode-bridge-prod
cp .env.example ~/opencode-bridge-prod/.env
cd ~/opencode-bridge-prod
opencode-bridge

# Or explicitly specify config directory
opencode-bridge --config-dir ~/.config/opencode-bridge
```
