/**
 * 과거 messageLogId fallback 등으로 스냅샷에 섞인 값을 병합 전 보정한다.
 * 채팅 message id는 타임라인 최신 id를 넘을 수 없다.
 */
export function sanitizePrevLastReadMessageIdForMerge(
  prevLastReadMessageId: number | null,
  latestKnownMessageId: number | null
): number | null {
  if (prevLastReadMessageId === null || latestKnownMessageId === null) {
    return prevLastReadMessageId;
  }

  return Math.min(prevLastReadMessageId, latestKnownMessageId);
}
