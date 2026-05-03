export function shouldScheduleReadSignCatchUp(params: {
  broadcastUserId: number;
  myUserId: number | null;
  targetMessageId: number | null;
  messageIds: readonly number[];
  confirmedLastReadMessageId: number | null;
}): boolean {
  const {
    broadcastUserId,
    myUserId,
    targetMessageId,
    messageIds,
    confirmedLastReadMessageId,
  } = params;

  if (myUserId === null || broadcastUserId !== myUserId) {
    return false;
  }

  if (targetMessageId === null) {
    return false;
  }

  if (messageIds.length === 0) {
    return true;
  }

  if (confirmedLastReadMessageId === null) {
    return true;
  }

  return confirmedLastReadMessageId < targetMessageId;
}
