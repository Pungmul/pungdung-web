import { resolveHeartbeatStaleThresholdMs } from "../../../stomp/stomp-liveness";
import type { SocketConnectionStateCheck } from "../../client/socket-manager";
import type { SocketConfig } from "../../protocol";

import {
  isStateCheckThrottled,
  shouldForceRecreateAfterBackground,
  type StateCheckOptions,
} from "./socket-recovery-policy";

export function createSocketStateCheckRunner(
  checkConnectionState: () => Promise<SocketConnectionStateCheck>,
  resolveConfig: () => Promise<SocketConfig | null>,
  backgroundForceReconnectMs: number,
  stateCheckThrottleMs: number,
  getLastStateCheckAt: () => number,
  setLastStateCheckAt: (timestamp: number) => void,
  isStateCheckInFlight: () => boolean,
  setStateCheckInFlight: (inFlight: boolean) => void,
  runRecovery: (
    checkOptions: StateCheckOptions,
    state: SocketConnectionStateCheck
  ) => Promise<void>,
  foregroundFastRecreateState: SocketConnectionStateCheck
) {
  return (checkOptions: StateCheckOptions = {}) => {
    if (typeof document !== "undefined" && document.hidden) {
      return;
    }
    if (isStateCheckInFlight()) {
      return;
    }

    const now = Date.now();
    if (
      isStateCheckThrottled(
        getLastStateCheckAt(),
        stateCheckThrottleMs,
        checkOptions.force
      )
    ) {
      return;
    }
    setLastStateCheckAt(now);

    setStateCheckInFlight(true);

    void (async () => {
      try {
        const backgroundDurationMs = checkOptions.backgroundDurationMs ?? 0;
        const config = await resolveConfig();
        const backgroundRecreateThresholdMs = config
          ? resolveHeartbeatStaleThresholdMs(config.stomp)
          : backgroundForceReconnectMs;
        const shouldRecreateAfterBackground = shouldForceRecreateAfterBackground(
          backgroundDurationMs,
          backgroundRecreateThresholdMs,
          checkOptions.trigger
        );

        if (shouldRecreateAfterBackground) {
          await runRecovery(
            {
              ...checkOptions,
              forceRecreate: true,
            },
            foregroundFastRecreateState
          );
          return;
        }

        const state = await checkConnectionState();

        if (state.healthy) {
          return;
        }

        await runRecovery(
          {
            ...checkOptions,
            forceRecreate:
              checkOptions.forceRecreate === true ||
              state.serverActivityStale === true,
          },
          state
        );
      } finally {
        setStateCheckInFlight(false);
      }
    })().catch((error) => {
      console.error("Socket state check failed:", error);
    });
  };
}
