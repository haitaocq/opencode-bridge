#!/usr/bin/env node

/**
 * 停止后台进程脚本
 *
 * 功能:
 * - 调用 process-manager.mjs 终止 Bridge 进程
 * - 清理 PID 文件
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const rootDir = path.resolve(scriptDir, '..');
const logsDir = path.join(rootDir, 'logs');
const pidFile = path.join(logsDir, 'bridge.pid');
const processManagerPath = path.join(rootDir, 'scripts', 'process-manager.mjs');

function main() {
  // 调用进程管理工具终止旧进程
  const result = spawnSync(process.execPath, [processManagerPath, 'kill-bridge'], {
    stdio: 'inherit',
  });

  // 清理 PID 文件
  fs.rmSync(pidFile, { force: true });

  if (result.error) {
    console.error('[stop] 执行失败:', result.error.message);
    process.exit(1);
  }
}

main();
