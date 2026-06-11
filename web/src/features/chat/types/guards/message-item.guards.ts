import type { Message } from "../chat-message.types";
import type { PendingMessage } from "../pending-message.types";

export function isPendingMessage(
  message: Message | PendingMessage
): message is PendingMessage {
  return "state" in message;
}
