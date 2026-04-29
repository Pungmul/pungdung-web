import type { StateCheckOptions } from "./socket-recovery-policy";

export function createSocketConnectionWatch(
  shouldProbeForMessageInactivity: (thresholdMs: number) => boolean,
  messageInactivityProbeMs: number,
  connectionWatchIntervalMs: number,
  isStateCheckInFlight: () => boolean,
  runStateCheck: (checkOptions: StateCheckOptions) => void
): () => void {
  const watchInterval = setInterval(() => {
    if (
      (typeof document !== "undefined" && document.hidden) ||
      isStateCheckInFlight()
    ) {
      return;
    }

    if (shouldProbeForMessageInactivity(messageInactivityProbeMs)) {
      runStateCheck({ trigger: "watch-inactivity" });
      return;
    }

    runStateCheck({ trigger: "watch-probe" });
  }, connectionWatchIntervalMs);

  return () => {
    clearInterval(watchInterval);
  };
}
