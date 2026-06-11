import { READ_SIGN_PUBLISH_STABILIZE_MS } from "../../constants/read-sign.constants";

export type ReadSignPublishScheduler = {
  schedule: () => void;
  flushNow: () => void;
  cancel: () => void;
};

export function createReadSignPublishScheduler(
  flush: () => Promise<void>,
  stabilizeMs = READ_SIGN_PUBLISH_STABILIZE_MS
): ReadSignPublishScheduler {
  let publishing = false;
  let needsAnotherPublish = false;
  let stabilizeTimer: ReturnType<typeof setTimeout> | null = null;

  const clearStabilizeTimer = (): void => {
    if (stabilizeTimer === null) {
      return;
    }

    clearTimeout(stabilizeTimer);
    stabilizeTimer = null;
  };

  const runFlush = async (): Promise<void> => {
    if (publishing) {
      needsAnotherPublish = true;
      return;
    }

    publishing = true;
    try {
      do {
        needsAnotherPublish = false;
        try {
          await flush();
        } catch {
          // caller(flush)가 pending 등으로 처리
        }
      } while (needsAnotherPublish);
    } finally {
      publishing = false;
    }
  };

  const triggerFlush = (immediate: boolean): void => {
    clearStabilizeTimer();

    if (immediate || stabilizeMs <= 0) {
      void runFlush();
      return;
    }

    stabilizeTimer = setTimeout(() => {
      stabilizeTimer = null;
      void runFlush();
    }, stabilizeMs);
  };

  return {
    schedule: () => {
      triggerFlush(false);
    },
    flushNow: () => {
      triggerFlush(true);
    },
    cancel: () => {
      clearStabilizeTimer();
    },
  };
}
