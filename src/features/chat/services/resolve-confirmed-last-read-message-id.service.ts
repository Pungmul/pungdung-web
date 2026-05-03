export function resolveConfirmedLastReadMessageId(
  messageIds: readonly number[],
): number | null {
  if (messageIds.length === 0) {
    return null;
  }

  return Math.max(...messageIds);
}
