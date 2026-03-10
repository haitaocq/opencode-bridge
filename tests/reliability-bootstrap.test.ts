import { describe, expect, it, vi } from 'vitest';
import {
  bootstrapReliabilityLifecycle,
  type ReliabilityLifecycleDependencies,
  type ReliabilityJobHandlers,
} from '../src/index.js';

describe('reliability bootstrap lifecycle', () => {
  it('启动时应初始化 heartbeat、scheduler 与 rescue orchestrator', async () => {
    const callTrace: string[] = [];

    const heartbeat = {
      onInboundMessage: vi.fn(async () => {
        callTrace.push('heartbeat.onInboundMessage');
      }),
    };

    const scheduler = {
      start: vi.fn(() => {
        callTrace.push('scheduler.start');
      }),
      stop: vi.fn(async () => {
        callTrace.push('scheduler.stop');
      }),
    };

    const rescueOrchestrator = {
      runWatchdogProbe: vi.fn(async () => {
        callTrace.push('rescue.watchdogProbe');
      }),
      runStaleCleanup: vi.fn(async () => {
        callTrace.push('rescue.staleCleanup');
      }),
      runBudgetReset: vi.fn(async () => {
        callTrace.push('rescue.budgetReset');
      }),
      cleanup: vi.fn(async () => {
        callTrace.push('rescue.cleanup');
      }),
    };

    let capturedHandlers: ReliabilityJobHandlers | null = null;
    const deps: ReliabilityLifecycleDependencies = {
      createHeartbeatEngine: () => heartbeat,
      createScheduler: () => scheduler,
      createRescueOrchestrator: () => rescueOrchestrator,
      createJobRegistry: (handlers) => {
        capturedHandlers = handlers;
        return {
          registerAll: (receivedScheduler) => {
            expect(receivedScheduler).toBe(scheduler);
            callTrace.push('registry.registerAll');
          },
        };
      },
      logger: {
        info: vi.fn(),
        error: vi.fn(),
      },
    };

    const lifecycle = bootstrapReliabilityLifecycle(deps);

    expect(callTrace).toEqual(['registry.registerAll', 'scheduler.start']);
    expect(capturedHandlers).not.toBeNull();

    await lifecycle.onInboundMessage();
    expect(heartbeat.onInboundMessage).toHaveBeenCalledTimes(1);

    await capturedHandlers?.watchdogProbe();
    await capturedHandlers?.staleCleanup();
    await capturedHandlers?.budgetReset();

    expect(rescueOrchestrator.runWatchdogProbe).toHaveBeenCalledTimes(1);
    expect(rescueOrchestrator.runStaleCleanup).toHaveBeenCalledTimes(1);
    expect(rescueOrchestrator.runBudgetReset).toHaveBeenCalledTimes(1);
  });

  it('退出时应清理 scheduler 与 rescue 资源且幂等', async () => {
    const schedulerStop = vi.fn(async () => undefined);
    const rescueCleanup = vi.fn(async () => undefined);

    const lifecycle = bootstrapReliabilityLifecycle({
      createHeartbeatEngine: () => ({
        onInboundMessage: async () => undefined,
      }),
      createScheduler: () => ({
        start: () => undefined,
        stop: schedulerStop,
      }),
      createRescueOrchestrator: () => ({
        runWatchdogProbe: async () => undefined,
        runStaleCleanup: async () => undefined,
        runBudgetReset: async () => undefined,
        cleanup: rescueCleanup,
      }),
      createJobRegistry: () => ({
        registerAll: () => undefined,
      }),
    });

    await lifecycle.cleanup();
    await lifecycle.cleanup();

    expect(schedulerStop).toHaveBeenCalledTimes(1);
    expect(rescueCleanup).toHaveBeenCalledTimes(1);
  });
});
