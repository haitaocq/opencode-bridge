# 部署与运维

本文档详细说明 OpenCode Bridge 的部署、升级和运维方法。

---

## 1. 环境要求

- **Node.js**: >= 18.0.0
- **操作系统**: Linux / macOS / Windows
- **OpenCode**: 需要安装并运行

---

## 2. 部署命令

### 已安装 Node 后可用命令

| 目标 | 命令 | 说明 |
|------|------|------|
| 一键部署 | `node scripts/deploy.mjs deploy` | 清洁安装后安装依赖并编译 |
| 一键升级 | `node scripts/deploy.mjs upgrade` | 先清理再拉取并重新部署 |
| 安装 OpenCode | `node scripts/deploy.mjs opencode-install` | 执行 `npm i -g opencode-ai` |
| 检查 OpenCode | `node scripts/deploy.mjs opencode-check` | 检查命令与端口监听 |
| 启动 OpenCode | `node scripts/deploy.mjs opencode-start` | 前台执行 `opencode` |
| 首次引导 | `node scripts/deploy.mjs guide` | 安装/部署/引导一体化流程 |
| 管理菜单 | `npm run manage:bridge` | 交互式菜单（默认入口） |
| 启动后台 | `npm run start` | 后台启动（自动检测/补构建） |
| 停止后台 | `node scripts/stop.mjs` | 按 PID 停止后台进程 |

---

## 3. Web 配置面板

### 访问地址

服务启动后，通过浏览器访问：

```
http://localhost:4098
```

### 面板功能

| 功能 | 说明 |
|------|------|
| 配置管理 | 实时修改飞书、Discord、企业微信、OpenCode 等配置 |
| Cron 管理 | 创建、启用/禁用、删除定时任务 |
| 服务状态 | 查看运行时长、版本、数据库路径 |
| 模型列表 | 获取 OpenCode 可用模型 |
| 服务控制 | 远程重启服务 |
| 平台状态 | 查看各平台连接状态 |

### 访问密码

- 首次访问时在 Web 面板设置
- 存储在 SQLite 数据库中
- 可在 Web 面板中修改

---

## 4. 配置存储

### SQLite 数据库

配置参数存储在 SQLite 数据库中：

- **数据库路径**: `data/config.db`
- **首次迁移**: 启动时自动从 `.env` 迁移
- **备份位置**: 原 `.env` 备份为 `.env.backup`

### 配置修改方式

| 方式 | 说明 |
|------|------|
| Web 面板 | 访问 `http://localhost:4098` 可视化修改 |
| SQLite 工具 | 直接编辑 `data/config.db` 数据库 |
| 配置文件 | 首次启动前在 `.env` 中配置（会自动迁移） |

---

## 5. systemd 常驻运行（Linux）

### 安装服务

通过管理菜单安装：

```bash
npm run manage:bridge
# 选择"安装并启动 systemd 服务"
```

### 手动配置

创建服务文件 `/etc/systemd/system/opencode-bridge.service`:

```ini
[Unit]
Description=OpenCode Bridge Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/opencode-bridge
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable opencode-bridge
sudo systemctl start opencode-bridge
```

### 日志位置

- 标准输出：`logs/service.log`
- 错误输出：`logs/service.err`

---

## 6. npm CLI 安装

适合本地常驻运行场景：

```bash
# 全局安装
npm install -g opencode-bridge

# 启动服务
opencode-bridge

# 指定配置目录
opencode-bridge --config-dir ~/.config/opencode-bridge
```

### 配置目录优先级

1. 当前工作目录下的 `.env`
2. `~/.config/opencode-bridge/.env`
3. `--config-dir` 指定的目录

---

## 7. 平台配置

### 飞书配置

详见 [飞书后台配置文档](feishu-config.md)。

### Discord 配置

详见 [Discord 配置文档](discord-config.md)。

### 企业微信配置

详见 [企业微信配置文档](wecom-config.md)。

---

## 8. 可靠性配置

详见 [可靠性指南](reliability.md)。

---

## 9. 故障排查

详见 [故障排查文档](troubleshooting.md)。

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 服务无法启动 | 检查端口占用，查看 `logs/service.err` |
| Web 面板无法访问 | 检查防火墙设置，确认服务已启动 |
| 平台无响应 | 检查平台配置，查看服务日志 |
| OpenCode 连接失败 | 检查 `OPENCODE_HOST` 和 `OPENCODE_PORT` 配置 |

---

## 10. 升级指南

### 源码部署升级

```bash
# 方式一：使用升级脚本
node scripts/deploy.mjs upgrade

# 方式二：手动升级
git pull origin main
npm install
npm run build
node scripts/stop.mjs
npm run start
```

### npm 安装升级

```bash
npm update -g opencode-bridge
```

---

## 11. 日志管理

### 日志文件

| 文件 | 说明 |
|------|------|
| `logs/service.log` | 服务标准输出 |
| `logs/service.err` | 服务错误输出 |
| `logs/bridge.pid` | 后台进程 PID |
| `logs/reliability-audit.jsonl` | 可靠性审计日志 |

### 日志轮转

建议配置 logrotate 进行日志轮转：

```conf
# /etc/logrotate.d/opencode-bridge
/path/to/opencode-bridge/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

---

## 12. 备份与恢复

### 备份

```bash
# 备份数据目录
tar -czvf opencode-bridge-backup.tar.gz data/

# 备份配置
cp data/config.db data/config.db.backup
```

### 恢复

```bash
# 恢复数据目录
tar -xzvf opencode-bridge-backup.tar.gz

# 恢复配置
cp data/config.db.backup data/config.db
```