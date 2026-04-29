import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

import { createSocketRecoveryRunner } from "./socket-recovery-runner";
import { createSocketStateCheckRunner } from "./socket-state-check-runner";

const FOREGROUND_FAST_RECREATE_STATE: SocketConnectionStateCheck = {
  healthy: false,
  workerAlive: true,
  stompConnected: false,
  webSocketOpen: false,
  webSocketReadyState: null,
  serverActivityStale: true,
  clientConnected: false,
};

export function createSocketReconnectSession(
  forceRecreateRuntime: (config: SocketConfig) => Promise<void>,
  ensureWorkerAlive: () => Promise<void>,
  forceReconnect: (config: SocketConfig) => Promise<void>,
  checkConnectionState: () => Promise<SocketConnectionStateCheck>,
  resolveConfig: () => Promise<SocketConfig | null>,
  backgroundForceReconnectMs: number,
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
    backgroundForceReconnectMs,
    recoveryActionCooldownMs,
    () => lastRecoveryActionAt,
    (timestamp) => {
      lastRecoveryActionAt = timestamp;
    }
  );

  const runStateCheck = createSocketStateCheckRunner(
    checkConnectionState,
    resolveConfig,
    backgroundForceReconnectMs,
    stateCheckThrottleMs,
    () => lastStateCheckAt,
    (timestamp) => {
      lastStateCheckAt = timestamp;
    },
    () => stateCheckInFlight,
    (inFlight) => {
      stateCheckInFlight = inFlight;
    },
    runRecovery,
    FOREGROUND_FAST_RECREATE_STATE
  );

  return {
    runStateCheck,
    isStateCheckInFlight: () => stateCheckInFlight,
  };
}
