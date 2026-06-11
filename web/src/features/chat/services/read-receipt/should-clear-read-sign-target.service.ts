export function shouldClearReadSignTarget(
  targetMessageId: number | null,
  confirmedLastReadMessageId: number | null,
): boolean {
  if (targetMessageId === null || confirmedLastReadMessageId === null) {
    return false;
  }

  return confirmedLastReadMessageId >= targetMessageId;
}
