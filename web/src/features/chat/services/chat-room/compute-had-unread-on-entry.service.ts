type ComputeHadUnreadOnEntryOptions = {
  /**
   * room list·IDB unread. 메시지 목록이 아직 따라오지 않았어도
   * 진입 스냅샷이 미읽음을 놓치지 않게 한다.
   */
  entryUnreadCountHint?: number;
};

/** 진입 시점에 이미 읽지 않은 메시지가 있었는지 판별한다. */
export function computeHadUnreadOnEntry(
  entryLastReadMessageId: number | null,
  latestMessageIdAtEntry: number | null,
  options?: ComputeHadUnreadOnEntryOptions
): boolean {
  if ((options?.entryUnreadCountHint ?? 0) > 0) {
    return true;
  }

  if (latestMessageIdAtEntry === null) {
    return false;
  }

  if (entryLastReadMessageId === null) {
    return true;
  }

  return latestMessageIdAtEntry > entryLastReadMessageId;
}
