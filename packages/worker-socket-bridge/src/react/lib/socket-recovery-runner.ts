import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

import {
  isRecoveryCooldownElapsed,
  shouldBypassRecoveryCooldown,
  shouldRecreateRuntime,
  type StateCheckOptions,
} from "./socket-recovery-policy";

export function createSocketRecoveryRunner(
  forceRecreateRuntime: (config: SocketConfig) => Promise<void>,
  ensureWorkerAlive: () => Promise<void>,
  forceReconnect: (config: SocketConfig) => Promise<void>,
  resolveConfig: () => Promise<SocketConfig | null>,
  backgroundForceReconnectMs: number,
  recoveryActionCooldownMs: number,
  getLastRecoveryActionAt: () => number,
  setLastRecoveryActionAt: (timestamp: number) => void
) {
  return async (
    checkOptions: StateCheckOptions,
    state: SocketConnectionStateCheck
  ) => {
    const trigger = checkOptions.trigger ?? "manual";
    const backgroundDurationMs = checkOptions.backgroundDurationMs ?? 0;

    if (
      !shouldBypassRecoveryCooldown(trigger) &&
      !isRecoveryCooldownElapsed(
        getLastRecoveryActionAt(),
        recoveryActionCooldownMs
      )
    ) {
      return;
    }

    const shouldRecreateRuntimeNow = shouldRecreateRuntime({
      reconnectOnly: checkOptions.reconnectOnly,
      forceRecreate: checkOptions.forceRecreate,
      backgroundDurationMs,
      backgroundForceReconnectMs,
      workerAlive: state.workerAlive,
    });
    const config = await resolveConfig();
    if (!config) {
      return;
    }

    if (shouldRecreateRuntimeNow) {
      await forceRecreateRuntime(config);
    } else {
      await ensureWorkerAlive();
      await forceReconnect(config);
    }

    setLastRecoveryActionAt(Date.now());
  };
}
