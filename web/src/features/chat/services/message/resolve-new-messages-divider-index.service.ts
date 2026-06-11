import { toNumericMessageId } from "../../lib/message/parse-message-id";
import type { Message, PendingMessage } from "../../types";
import { countUnreadMessagesAfterEntry } from "../chat-room/count-unread-messages-after-entry.service";

export function resolveNewMessagesDividerIndex(
  messages: readonly (Message | PendingMessage)[],
  entryLastReadMessageId: number | null,
  options?: { minUnreadCount?: number }
): number | null {
  if (entryLastReadMessageId === null) {
    return null;
  }

  const unreadCount = countUnreadMessagesAfterEntry(
    messages,
    entryLastReadMessageId
  );
  const minUnreadCount = options?.minUnreadCount ?? 0;
  if (unreadCount < minUnreadCount) {
    return null;
  }

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index]!;
    const numericMessageId = toNumericMessageId(message.id);
    if (numericMessageId === null) {
      continue;
    }

    if (numericMessageId > entryLastReadMessageId) {
      return index;
    }
  }

  return null;
}
