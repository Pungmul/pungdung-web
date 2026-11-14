import {
  isRecoveryCooldownElapsed,
  shouldBypassRecoveryCooldown,
  shouldRecreateRuntime,
  type StateCheckOptions,
} from "./socket-recovery-policy";
import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

export function createSocketRecoveryRunner(
  forceRecreateRuntime: (config: SocketConfig) => Promise<void>,
  ensureWorkerAlive: () => Promise<void>,
  forceReconnect: (config: SocketConfig) => Promise<void>,
  resolveConfig: () => Promise<SocketConfig | null>,
  recoveryActionCooldownMs: number,
  getLastRecoveryActionAt: () => number,
  setLastRecoveryActionAt: (timestamp: number) => void,
  onWorkerRecoveryFailure: () => void = () => {}
) {
  let sequence = 0;
  let failureTimer: ReturnType<typeof setTimeout> | undefined;

  const run = async (
    checkOptions: StateCheckOptions,
    state: SocketConnectionStateCheck
  ) => {
    const trigger = checkOptions.trigger ?? "manual";

    if (
      !shouldBypassRecoveryCooldown(trigger) &&
      !isRecoveryCooldownElapsed(
        getLastRecoveryActionAt(),
        recoveryActionCooldownMs
      )
    ) {
      return;
    }

    const currentSequence = ++sequence;
    clearTimeout(failureTimer);

    const shouldRecreateRuntimeNow = shouldRecreateRuntime({
      reconnectOnly: checkOptions.reconnectOnly,
      forceRecreate: checkOptions.forceRecreate,
      workerAlive: state.workerAlive,
    });
    let config: SocketConfig | null;
    const configTimer = !state.workerAlive
      ? setTimeout(() => {
          if (currentSequence === sequence) onWorkerRecoveryFailure();
        }, 10_000)
      : undefined;
    failureTimer = configTimer;
    try {
      config = await resolveConfig();
    } catch (error) {
      if (!state.workerAlive && currentSequence === sequence) {
        onWorkerRecoveryFailure();
      }
      throw error;
    } finally {
      clearTimeout(configTimer);
      if (failureTimer === configTimer) failureTimer = undefined;
    }
    if (!config || currentSequence !== sequence) {
      if (!config && !state.workerAlive && currentSequence === sequence) {
        onWorkerRecoveryFailure();
      }
      return;
    }

    if (shouldRecreateRuntimeNow) {
      if (state.workerAlive) {
        await forceRecreateRuntime(config);
      } else {
        let reported = false;
        const reportFailure = () => {
          if (!reported && currentSequence === sequence) {
            reported = true;
            onWorkerRecoveryFailure();
          }
        };
        const timer = setTimeout(reportFailure, 10_000);
        failureTimer = timer;

        try {
          await forceRecreateRuntime(config);
        } catch (error) {
          reportFailure();
          throw error;
        } finally {
          clearTimeout(timer);
          if (failureTimer === timer) failureTimer = undefined;
        }
      }
    } else {
      await ensureWorkerAlive();
      await forceReconnect(config);
    }

    if (currentSequence === sequence) setLastRecoveryActionAt(Date.now());
  };

  return Object.assign(run, {
    dispose: () => {
      sequence += 1;
      clearTimeout(failureTimer);
    },
  });
}
