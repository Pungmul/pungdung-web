import type { SocketConnectionStateCheck } from "../../client/socket-manager";

import {
  isStateCheckThrottled,
  shouldBypassStateCheckInFlight,
  type StateCheckOptions,
} from "./socket-recovery-policy";

export function createSocketStateCheckRunner(
  checkConnectionState: () => Promise<SocketConnectionStateCheck>,
  stateCheckThrottleMs: number,
  getLastStateCheckAt: () => number,
  setLastStateCheckAt: (timestamp: number) => void,
  isStateCheckInFlight: () => boolean,
  setStateCheckInFlight: (inFlight: boolean) => void,
  runRecovery: (
    checkOptions: StateCheckOptions,
    state: SocketConnectionStateCheck
  ) => Promise<void>
) {
  return (checkOptions: StateCheckOptions = {}) => {
    if (typeof document !== "undefined" && document.hidden) {
      return;
    }
    if (
      isStateCheckInFlight() &&
      !shouldBypassStateCheckInFlight(checkOptions.trigger, checkOptions.force)
    ) {
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
        const state = await checkConnectionState();

        if (state.healthy) {
          return;
        }

        await runRecovery(
          {
            ...checkOptions,
            forceRecreate:
              checkOptions.forceRecreate === true ||
              !state.workerAlive ||
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
