import { resolveConfirmedLastReadMessageId } from "./resolve-confirmed-last-read-message-id.service";

export type OtherParticipantReadSnapshot = Record<number, number | null>;

type MergeOtherParticipantReadFromSocketParams = {
  userId: number;
  messageIds: readonly number[];
};

/**
 * 읽음 소켓 payload를 기준으로 "다른 참여자" 읽음 스냅샷을 병합한다.
 * `messageIds`가 비어 있으면 서버 확정이 아니므로 기존 스냅샷을 유지한다.
 */
export function mergeOtherParticipantReadFromSocket(
  prev: OtherParticipantReadSnapshot,
  params: MergeOtherParticipantReadFromSocketParams
): OtherParticipantReadSnapshot {
  const { userId, messageIds } = params;
  const lastReadMessageId = resolveConfirmedLastReadMessageId(messageIds);
  if (lastReadMessageId === null) {
    return prev;
  }

  const prevLastReadMessageId = prev[userId] ?? null;
  const nextLastReadMessageId =
    prevLastReadMessageId !== null
      ? Math.max(prevLastReadMessageId, lastReadMessageId)
      : lastReadMessageId;

  if (nextLastReadMessageId === prevLastReadMessageId) {
    return prev;
  }

  return {
    ...prev,
    [userId]: nextLastReadMessageId,
  };
}
