import type { ShouldShowDirectReadLabelParams } from "../types/read-receipt-display.types";

export function shouldShowDirectReadLabel({
  context,
  messageId,
  isMyMessage,
  isLatestMessageFromOpponent,
}: ShouldShowDirectReadLabelParams): boolean {
  if (context.mode !== "direct" || !isMyMessage) {
    return false;
  }

  if (isLatestMessageFromOpponent) {
    return false;
  }

  if (context.opponentLastReadMessageId === null) {
    return false;
  }

  return messageId === context.opponentLastReadMessageId;
}
