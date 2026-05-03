import dayjs from "dayjs";

import type { Message, PendingMessage } from "../types";

export function getMessageDateKey(message: Message | PendingMessage): string {
  return dayjs(message.createdAt).format("YYYY-MM-DD");
}

export function getMessageDisplayDate(
  message: Message | PendingMessage
): string {
  return dayjs(message.createdAt).format("YYYY.MM.DD ddd");
}

export function isSameMessageDate(
  left: Message | PendingMessage,
  right: Message | PendingMessage | undefined
): boolean {
  return right !== undefined && getMessageDateKey(left) === getMessageDateKey(right);
}
