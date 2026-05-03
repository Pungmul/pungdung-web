import type { Message, PendingMessage } from "../types";

export function isPendingMessage(
  message: Message | PendingMessage
): message is PendingMessage {
  return "state" in message;
}
