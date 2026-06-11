import type { ReadAtResolutionMessage } from "./resolve-last-read-message-id-from-read-at.service";
import { resolveLastReadMessageIdFromReadBroadcast } from "./resolve-last-read-message-id-from-read-broadcast.service";
import { sanitizePrevLastReadMessageIdForMerge } from "./sanitize-prev-last-read-message-id-for-merge.service";
import { resolveLatestNumericMessageIdFromList } from "../message/resolve-latest-numeric-message-id-from-list.service";

export type OtherParticipantReadSnapshot = Record<number, number | null>;

type MergeOtherParticipantReadFromSocketParams = {
  userId: number;
  messageIds: readonly number[];
  readAt?: string | null | undefined;
  timelineMessages?: readonly ReadAtResolutionMessage[] | undefined;
  /** store 등 호출부에서 이미 해석한 값 (중복 resolve 방지) */
  resolvedLastReadMessageId?: number | null | undefined;
};

/**
 * 읽음 소켓 payload를 기준으로 "다른 참여자" 읽음 스냅샷을 병합한다.
 * messageIds 확정 → readAt+타임라인 순으로 last read를 해석한다.
 */
export function mergeOtherParticipantReadFromSocket(
  prev: OtherParticipantReadSnapshot,
  params: MergeOtherParticipantReadFromSocketParams
): OtherParticipantReadSnapshot {
  const { userId, messageIds, readAt, timelineMessages, resolvedLastReadMessageId } =
    params;
  const lastReadMessageId =
    resolvedLastReadMessageId ??
    resolveLastReadMessageIdFromReadBroadcast({
      messageIds,
      readAt,
      timelineMessages,
    });
  if (lastReadMessageId === null) {
    return prev;
  }

  const latestKnownMessageId =
    timelineMessages !== undefined && timelineMessages.length > 0
      ? resolveLatestNumericMessageIdFromList(timelineMessages)
      : null;
  const prevLastReadMessageId = sanitizePrevLastReadMessageIdForMerge(
    prev[userId] ?? null,
    latestKnownMessageId
  );
  const nextLastReadMessageId =
    prevLastReadMessageId !== null
      ? Math.max(prevLastReadMessageId, lastReadMessageId)
      : lastReadMessageId;

  if (nextLastReadMessageId === prev[userId]) {
    return prev;
  }

  return {
    ...prev,
    [userId]: nextLastReadMessageId,
  };
}
