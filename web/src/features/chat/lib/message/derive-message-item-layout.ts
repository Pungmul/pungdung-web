import { formatMessageTime } from "./format-message-time";
import {
  getMessageDateKey,
  getMessageDisplayDate,
  isSameMessageDate,
} from "./message-date";
import type { MessageItemLayoutContext } from "./message-item-layout.types";
import type { Message, PendingMessage } from "../../types";
import type { ReadReceiptAvatar } from "../../types/read-receipt.types";

interface DeriveMessageItemLayoutParams {
  message: Message | PendingMessage;
  prevMessage: (Message | PendingMessage) | undefined;
  nextMessage: (Message | PendingMessage) | undefined;
  currentUserId: string;
  isDirectChat: boolean;
  readReceiptAvatars: readonly ReadReceiptAvatar[];
  onSenderProfileClick: (() => void) | undefined;
}

export function deriveMessageItemLayout({
  message,
  prevMessage,
  nextMessage,
  currentUserId,
  isDirectChat,
  readReceiptAvatars,
  onSenderProfileClick,
}: DeriveMessageItemLayoutParams): MessageItemLayoutContext {
  const isUser = message.senderUsername === currentUserId;
  const timeStamp = formatMessageTime(new Date(message.createdAt));

  const isSameTimeBefore =
    prevMessage !== undefined &&
    message.senderUsername === prevMessage.senderUsername &&
    formatMessageTime(new Date(message.createdAt)) ===
      formatMessageTime(new Date(prevMessage.createdAt));

  const isSameTimeAfter =
    nextMessage !== undefined &&
    message.senderUsername === nextMessage.senderUsername &&
    formatMessageTime(new Date(message.createdAt)) ===
      formatMessageTime(new Date(nextMessage.createdAt));

  const isSameDate = isSameMessageDate(message, prevMessage);
  const dateKey = getMessageDateKey(message);
  const displayDate = getMessageDisplayDate(message);

  const showDirectReadSlot = isUser && isDirectChat;
  const showTimestamp = !isSameTimeAfter;
  const hasSideContent =
    showDirectReadSlot || (showTimestamp && !!message.createdAt);

  return {
    isUser,
    timeStamp,
    isSameTimeBefore,
    isSameTimeAfter,
    isSameDate,
    dateKey,
    displayDate,
    showDirectReadSlot,
    showTimestamp,
    hasSideContent,
    readReceiptAlign: isUser ? "right" : "left",
    hasGroupReadReceipts: readReceiptAvatars.length > 0,
    senderProfileClickHandler:
      !isUser && !isSameTimeBefore ? onSenderProfileClick : undefined,
  };
}
