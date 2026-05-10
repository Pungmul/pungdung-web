import { toNumericMessageId } from "../../lib/message/parse-message-id";
import type { Message, PendingMessage } from "../../types";

export function countUnreadMessagesAfterEntry(
  messages: readonly (Message | PendingMessage)[],
  entryLastReadMessageId: number | null
): number {
  if (entryLastReadMessageId === null) {
    return 0;
  }

  let count = 0;
  for (const message of messages) {
    const numericMessageId = toNumericMessageId(message.id);
    if (numericMessageId === null) {
      continue;
    }
    if (numericMessageId > entryLastReadMessageId) {
      count += 1;
    }
  }

  return count;
}
