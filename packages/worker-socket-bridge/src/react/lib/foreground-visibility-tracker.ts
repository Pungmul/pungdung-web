import type { StateCheckTrigger } from "./socket-recovery-policy";

export function createForegroundVisibilityTracker(
  debounceMs: number,
  onForegroundCheck: (trigger: StateCheckTrigger) => void
) {
  let pendingTrigger: StateCheckTrigger | null = null;
  let flushScheduled = false;

  const flushForegroundCheck = () => {
    flushScheduled = false;
    const trigger = pendingTrigger;
    pendingTrigger = null;
    if (!trigger) {
      return;
    }

    onForegroundCheck(trigger);
  };

  const scheduleCheck = (trigger: StateCheckTrigger) => {
    pendingTrigger = trigger;

    if (flushScheduled) {
      return;
    }

    flushScheduled = true;

    if (debounceMs <= 0) {
      queueMicrotask(flushForegroundCheck);
      return;
    }

    setTimeout(flushForegroundCheck, debounceMs);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      return;
    }

    scheduleCheck("visibilitychange");
  };

  const handlePageShow = () => {
    scheduleCheck("pageshow");
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pageshow", handlePageShow);

  const dispose = () => {
    flushScheduled = false;
    pendingTrigger = null;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pageshow", handlePageShow);
  };

  return {
    scheduleCheck,
    dispose,
  };
}
