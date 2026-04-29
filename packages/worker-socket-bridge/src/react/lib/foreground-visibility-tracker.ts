import type { StateCheckTrigger } from "./socket-recovery-policy";

export function createForegroundVisibilityTracker(
  debounceMs: number,
  onForegroundCheck: (
    trigger: StateCheckTrigger,
    backgroundDurationMs: number
  ) => void
) {
  let lastHiddenAt: number | null = null;
  let pendingCheck: {
    trigger: StateCheckTrigger;
    backgroundDurationMs: number;
  } | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const flushForegroundCheck = () => {
    const pending = pendingCheck;
    pendingCheck = null;
    debounceTimer = null;
    if (!pending) {
      return;
    }

    onForegroundCheck(pending.trigger, pending.backgroundDurationMs);
  };

  const scheduleCheck = (
    trigger: StateCheckTrigger,
    backgroundDurationMs: number
  ) => {
    const current = pendingCheck;
    pendingCheck = {
      trigger,
      backgroundDurationMs: Math.max(
        current?.backgroundDurationMs ?? 0,
        backgroundDurationMs
      ),
    };

    if (debounceTimer !== null) {
      return;
    }

    debounceTimer = setTimeout(flushForegroundCheck, debounceMs);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      lastHiddenAt = Date.now();
      return;
    }

    const backgroundDurationMs = lastHiddenAt ? Date.now() - lastHiddenAt : 0;
    lastHiddenAt = null;
    scheduleCheck("visibilitychange", backgroundDurationMs);
  };

  const handlePageHide = () => {
    lastHiddenAt = Date.now();
  };

  const handlePageShow = () => {
    const backgroundDurationMs = lastHiddenAt ? Date.now() - lastHiddenAt : 0;
    lastHiddenAt = null;
    scheduleCheck("pageshow", backgroundDurationMs);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePageHide);
  window.addEventListener("pageshow", handlePageShow);

  const dispose = () => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    pendingCheck = null;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
    window.removeEventListener("pageshow", handlePageShow);
  };

  return {
    scheduleCheck,
    dispose,
  };
}
