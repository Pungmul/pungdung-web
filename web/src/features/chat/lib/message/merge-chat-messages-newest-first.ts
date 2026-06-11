import { sortMessagesNewestFirst } from "./compare-message-order";
import type { Message } from "../../types";

export function mergeChatMessagesNewestFirst(
  existing: readonly Message[],
  incoming: readonly Message[],
): Message[] {
  const byId = new Map<string, Message>();

  for (const message of [...existing, ...incoming]) {
    byId.set(String(message.id), message);
  }

  return sortMessagesNewestFirst(Array.from(byId.values()));
}
