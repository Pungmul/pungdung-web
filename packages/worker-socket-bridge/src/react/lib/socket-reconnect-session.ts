import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

import { createSocketRecoveryRunner } from "./socket-recovery-runner";
import { createSocketStateCheckRunner } from "./socket-state-check-runner";

export function createSocketReconnectSession(
  forceRecreateRuntime: (config: SocketConfig) => Promise<void>,
  ensureWorkerAlive: () => Promise<void>,
  forceReconnect: (config: SocketConfig) => Promise<void>,
  checkConnectionState: () => Promise<SocketConnectionStateCheck>,
  resolveConfig: () => Promise<SocketConfig | null>,
  recoveryActionCooldownMs: number,
  stateCheckThrottleMs: number
) {
  let lastStateCheckAt = 0;
  let lastRecoveryActionAt = 0;
  let stateCheckInFlight = false;

  const runRecovery = createSocketRecoveryRunner(
    forceRecreateRuntime,
    ensureWorkerAlive,
    forceReconnect,
    resolveConfig,
    recoveryActionCooldownMs,
    () => lastRecoveryActionAt,
    (timestamp) => {
      lastRecoveryActionAt = timestamp;
    }
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
    runRecovery
  );

  return {
    runStateCheck,
    isStateCheckInFlight: () => stateCheckInFlight,
  };
}
