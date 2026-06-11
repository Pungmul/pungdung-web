import type { ReadAtResolutionMessage } from "./resolve-last-read-message-id-from-read-at.service";
import { resolveLastReadMessageIdFromReadBroadcast } from "./resolve-last-read-message-id-from-read-broadcast.service";
import { shouldClearReadSignTarget } from "./should-clear-read-sign-target.service";
import { shouldScheduleReadSignCatchUp } from "./should-schedule-read-sign-catch-up.service";

export type ReadSignBroadcastRuntimeSlice = {
  myUserId: number | null;
  targetMessageId: number | null;
  catchUpAttempts: number;
};

export type ResolveReadBroadcastParams = {
  messageIds: readonly number[];
  readAt: string;
  timelineMessages?: readonly ReadAtResolutionMessage[] | undefined;
  runtime: ReadSignBroadcastRuntimeSlice;
  isMyReadBroadcast: boolean;
};

export function resolveReadBroadcastLastReadMessageId(
  params: ResolveReadBroadcastParams
): number | null {
  return resolveLastReadMessageIdFromReadBroadcast({
    messageIds: params.messageIds,
    readAt: params.readAt,
    timelineMessages: params.timelineMessages,
    fallbackLastReadMessageId: params.isMyReadBroadcast
      ? params.runtime.targetMessageId
      : null,
  });
}

export type MyReadBroadcastAction =
  | { type: "clear_target" }
  | { type: "schedule_catch_up" }
  | { type: "noop" };

export function resolveMyReadBroadcastAction(params: {
  runtime: ReadSignBroadcastRuntimeSlice;
  broadcastUserId: number;
  messageIds: readonly number[];
  resolvedLastReadMessageId: number | null;
}): MyReadBroadcastAction {
  const { runtime, broadcastUserId, messageIds, resolvedLastReadMessageId } =
    params;

  if (
    shouldClearReadSignTarget(
      runtime.targetMessageId,
      resolvedLastReadMessageId
    )
  ) {
    return { type: "clear_target" };
  }

  if (
    shouldScheduleReadSignCatchUp({
      broadcastUserId,
      myUserId: runtime.myUserId,
      targetMessageId: runtime.targetMessageId,
      messageIds,
      confirmedLastReadMessageId: resolvedLastReadMessageId,
    })
  ) {
    return { type: "schedule_catch_up" };
  }

  return { type: "noop" };
}
