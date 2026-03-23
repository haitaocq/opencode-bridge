# Discord 配置指南

本文档说明如何配置 Discord 机器人以连接到 OpenCode Bridge。

---

## 1. 前置条件

- OpenCode Bridge 服务已部署
- OpenCode 已安装并运行
- Discord 账号

---

## 2. 创建 Discord 应用

### 步骤 1：创建应用

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 "New Application" 创建新应用
3. 填写应用名称，点击 "Create"

### 步骤 2：创建机器人

1. 在应用页面，选择 "Bot" 选项卡
2. 点击 "Add Bot" 创建机器人
3. 在 "Token" 部分，点击 "Copy" 复制 Bot Token

### 步骤 3：启用 Intents

在 Bot 选项卡中，启用以下 Intents：

- **Presence Intent**：在线状态追踪
- **Server Members Intent**：成员事件
- **Message Content Intent**：**必需**，用于读取消息内容

---

## 3. Bridge 配置

### Web 面板配置

在 Web 配置面板（`http://localhost:4098`）中：

1. 进入"平台接入" → "Discord" 配置
2. 将"是否启用 Discord 适配器"设置为 `true`
3. 填写 Discord Bot Token
4. 填写 Discord Client ID（可选，用于高级功能）
5. 保存配置

### 配置参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `DISCORD_ENABLED` | 否 | `false` | 是否启用 Discord 适配器 |
| `DISCORD_TOKEN` | 是 | - | Discord Bot Token |
| `DISCORD_CLIENT_ID` | 否 | - | Discord 应用 Client ID |
| `DISCORD_SHOW_THINKING_CHAIN` | 否 | - | 显示 AI 思维链 |
| `DISCORD_SHOW_TOOL_CHAIN` | 否 | - | 显示工具调用链 |

---

## 4. 邀请机器人到服务器

### 生成邀请链接

1. 在应用页面，选择 "OAuth2" → "URL Generator"
2. 在 "SCOPES" 中选择 "bot"
3. 在 "BOT PERMISSIONS" 中选择：
   - Send Messages
   - Read Message History
   - Embed Links
   - Attach Files
   - Add Reactions
   - Use Slash Commands（可选）

### 邀请机器人

1. 复制生成的 URL
2. 在浏览器中打开
3. 选择要邀请机器人的服务器
4. 点击 "Authorize"

---

## 5. 使用方式

### 私聊

直接向机器人发送消息即可。

### 群聊

- @提及机器人，然后发送消息
- 或使用 `/` 命令

### 可用命令

| 命令 | 说明 |
|------|------|
| `///session` | 查看绑定的会话 |
| `///new` | 新建并绑定会话 |
| `///bind <sessionId>` | 绑定已有会话 |
| `///undo` | 撤回上一轮 |
| `///compact` | 压缩上下文 |
| `///cron ...` | 管理 Cron 任务 |

---

## 6. 故障排查

### 机器人无响应

1. 检查 `DISCORD_ENABLED` 是否为 `true`
2. 检查 `DISCORD_TOKEN` 是否正确
3. 检查机器人是否在线（在 Discord 中显示在线状态）
4. 查看服务日志中的错误信息

### 命令不工作

1. 确保 Message Content Intent 已开启
2. 检查机器人是否有读取消息历史的权限
3. 确认命令格式正确

### 消息发送失败

1. 检查机器人权限是否足够
2. 检查频道权限是否允许机器人发送消息
3. 检查网络连接是否正常

---

## 7. 注意事项

- Discord 适配器支持文本消息和组件交互
- 不支持富文本卡片（使用 Embed 和组件代替）
- 文件发送受限于 Discord API（标准 8MB，Nitro 50MB）
- 建议在测试频道中先验证配置
- 必须开启 Message Content Intent 才能读取消息内容