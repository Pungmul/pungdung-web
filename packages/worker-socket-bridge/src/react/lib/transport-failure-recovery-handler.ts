import {
  isHeartbeatLostReason,
  readTransportRecoverySignal,
} from "../../../stomp/stomp-liveness";

import type { StateCheckOptions } from "./socket-recovery-policy";

type RunStateCheck = (checkOptions?: StateCheckOptions) => void;

export function createTransportFailureRecoveryHandler(
  debounceMs: number,
  runStateCheck: RunStateCheck
) {
  let debounceTimerId: ReturnType<typeof setTimeout> | null = null;

  const handleTransportFailure = (error: unknown) => {
    if (debounceTimerId !== null) {
      clearTimeout(debounceTimerId);
    }

    debounceTimerId = setTimeout(() => {
      debounceTimerId = null;

      const recoverySignal = readTransportRecoverySignal(error);
      const heartbeatLost = isHeartbeatLostReason(recoverySignal?.reason);
      runStateCheck({
        trigger: heartbeatLost ? "heartbeat-lost" : "transport-failure",
        force: true,
        forceRecreate: recoverySignal?.forceRecreate ?? heartbeatLost,
      });
    }, debounceMs);
  };

  return {
    handleTransportFailure,
    dispose() {
      if (debounceTimerId !== null) {
        clearTimeout(debounceTimerId);
        debounceTimerId = null;
      }
    },
  };
}
