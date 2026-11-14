import type { StateCheckOptions } from "./socket-recovery-policy";
import { createSocketRecoveryRunner } from "./socket-recovery-runner";
import { createSocketStateCheckRunner } from "./socket-state-check-runner";
import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

export function createSocketReconnectSession(
  forceRecreateRuntime: (config: SocketConfig) => Promise<void>,
  ensureWorkerAlive: () => Promise<void>,
  forceReconnect: (config: SocketConfig) => Promise<void>,
  checkConnectionState: (options: StateCheckOptions) => Promise<SocketConnectionStateCheck>,
  resolveConfig: () => Promise<SocketConfig | null>,
  recoveryActionCooldownMs: number,
  stateCheckThrottleMs: number,
  onWorkerRecoveryFailure: () => void = () => {}
) {
  let lastStateCheckAt = 0;
  let lastRecoveryActionAt = 0;
  let stateCheckInFlight = false;
  let disposed = false;

  const runRecovery = createSocketRecoveryRunner(
    forceRecreateRuntime,
    ensureWorkerAlive,
    forceReconnect,
    resolveConfig,
    recoveryActionCooldownMs,
    () => lastRecoveryActionAt,
    (timestamp) => {
      lastRecoveryActionAt = timestamp;
    },
    onWorkerRecoveryFailure
  );

  const runStateCheck = createSocketStateCheckRunner(
    checkConnectionState,
    stateCheckThrottleMs,
    () => lastStateCheckAt,
    (timestamp) => {
      lastStateCheckAt = timestamp;
    },
    () => stateCheckInFlight,
    (inFlight) => {
      stateCheckInFlight = inFlight;
    },
    (options, state) => disposed ? Promise.resolve() : runRecovery(options, state)
  );

  return {
    runStateCheck,
    dispose: () => {
      disposed = true;
      runRecovery.dispose();
    },
    isStateCheckInFlight: () => stateCheckInFlight,
  };
}
