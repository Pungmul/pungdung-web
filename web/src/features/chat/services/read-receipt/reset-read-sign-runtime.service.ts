import type { ReadSignPublishScheduler } from "./create-read-sign-publish-scheduler.service";

export type ReadSignRuntimeResetSlice = {
  catchUpTimer: ReturnType<typeof setTimeout> | null;
  publishScheduler: ReadSignPublishScheduler | null;
  targetMessageId: number | null;
  pending: boolean;
  catchUpAttempts: number;
};

export function clearReadSignCatchUpTimer(
  runtime: ReadSignRuntimeResetSlice
): void {
  if (runtime.catchUpTimer === null) {
    return;
  }

  clearTimeout(runtime.catchUpTimer);
  runtime.catchUpTimer = null;
}

export function resetReadSignRuntimeState(
  runtime: ReadSignRuntimeResetSlice
): void {
  clearReadSignCatchUpTimer(runtime);
  runtime.publishScheduler = null;
  runtime.targetMessageId = null;
  runtime.pending = false;
  runtime.catchUpAttempts = 0;
}
