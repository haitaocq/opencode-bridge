# 进程管理增强实施计划

## 目标
1. 所有启动项具备清理旧进程能力（包括 `npm run start`）
2. Windows/Linux/macOS 跨平台支持
3. ENV 增加 `OPENCODE_AUTO_START` 选项，后台自动启动 OpenCode
4. 增强程序退出机制，优先终止 OpenCode 子进程

## 完成情况

### Phase 1: 跨平台进程管理工具 ✅
**文件**: `scripts/process-manager.mjs`
- [x] 实现 `isWindows()` 检测
- [x] 实现 `findBridgeProcesses()` 跨平台扫描
  - Windows: `tasklist` 命令
  - Unix: `ps aux` 命令
- [x] 实现 `stopProcesses(pids)` 跨平台终止
  - Windows: `taskkill /PID`
  - Unix: `process.kill(pid, 'SIGTERM')` → `SIGKILL`
- [x] 实现 `findOpenCodeProcesses()` 扫描 OpenCode 进程
- [x] 实现 `stopOpenCodeProcesses()` 终止 OpenCode 进程
- [x] 导出 CLI 接口，支持 `kill-bridge` 和 `kill-opencode`

**完成标准**: ✅
- 在 Windows 和 Linux 上都能正确扫描并终止进程
- TypeScript 编译通过

---

### Phase 2: 集成到主程序 ✅
**文件**: `src/utils/process-cleanup.ts` (新增)
- [x] 封装 `scripts/process-manager.mjs` 的调用逻辑
- [x] 导出 `cleanupStaleProcesses(): Promise<void>`
- [x] 导出 `cleanupOpenCodeProcesses(): Promise<void>`

**文件**: `src/index.ts`
- [x] 在 `main()` 开头调用 `cleanupStaleProcesses()`
- [x] 如果 `OPENCODE_AUTO_START=true`，调用 `cleanupOpenCodeProcesses()`
- [x] spawn OpenCode 子进程并记录 PID
- [x] 在 `gracefulShutdown()` 中先终止 OpenCode 子进程

**完成标准**: ✅
- TypeScript 编译通过
- 启动时能清理旧进程

---

### Phase 3: ENV 配置 ✅
**文件**: `.env.example`
- [x] 增加 `OPENCODE_AUTO_START=false` 选项
- [x] 增加 `OPENCODE_AUTO_START_CMD=opencode` 可配置启动命令

**文件**: `src/config.ts`
- [x] 增加 `opencodeAutoStart: boolean` 配置项
- [x] 增加 `opencodeAutoStartCmd: string` 配置项

**完成标准**: ✅
- 配置可正确读取

---

### Phase 4: 更新启动/停止脚本 ✅
**文件**: `scripts/start.mjs`
- [x] 调用 `process-manager.mjs` 清理旧进程

**文件**: `scripts/stop.mjs`
- [x] 调用 `process-manager.mjs` 终止 Bridge 进程

**完成标准**: ✅
- 启动/停止脚本在 Windows 和 Linux 上都能正常工作

---

### Phase 5: 测试验证 ✅
- [x] TypeScript 编译通过
- [x] 进程管理工具 CLI 测试通过
- [x] 现有测试大部分通过（失败测试与本次修改无关）

---

## 最终文件结构

```
scripts/
  process-manager.mjs    # 跨平台进程管理工具 (新增)

src/
  utils/
    process-cleanup.ts   # 主程序进程清理封装 (新增)
  index.ts               # 集成清理逻辑 (修改)
  config.ts              # 增加 OpenCode 自启配置 (修改)

.env.example             # 增加 OPENCODE_AUTO_START (修改)
scripts/
  start.mjs              # 调用进程清理 (修改)
  stop.mjs               # 调用进程清理 (修改)
```

---

## 使用方式

### 1. 启动服务（自动清理旧进程）
```bash
# 方式 1: 使用启动脚本
node scripts/start.mjs

# 方式 2: 使用 npm
npm run start:bridge

# 方式 3: 直接运行（也会清理旧进程）
npm run start

# 方式 4: 管理菜单
npm run manage:bridge
```

### 2. 停止服务
```bash
# 方式 1: 使用停止脚本
node scripts/stop.mjs

# 方式 2: 使用 npm
npm run stop:bridge

# 方式 3: 管理菜单
npm run manage:bridge
```

### 3. 手动清理进程
```bash
# 清理 Bridge 进程
node scripts/process-manager.mjs kill-bridge

# 清理 OpenCode 进程
node scripts/process-manager.mjs kill-opencode

# 列出 Bridge 进程
node scripts/process-manager.mjs list-bridge

# 列出 OpenCode 进程
node scripts/process-manager.mjs list-opencode
```

### 4. 自动启动 OpenCode
在 `.env` 中配置：
```env
OPENCODE_AUTO_START=true
OPENCODE_AUTO_START_CMD=opencode
```

---

## 注意事项

1. **跨平台兼容性**: 所有进程管理命令已同时支持 Windows 和 Unix
2. **代码分离**: 新增能力单独放在新文件，避免 `src/index.ts` 过于臃肿
3. **优雅退出**: OpenCode 子进程必须在 Bridge 资源清理前终止
4. **日志输出**: 所有进程清理操作有清晰的日志输出
