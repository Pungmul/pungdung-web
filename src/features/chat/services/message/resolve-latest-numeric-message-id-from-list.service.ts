import { toNumericMessageId } from "../../lib/message/parse-message-id";

export function resolveLatestNumericMessageIdFromList(
  messages: readonly { id: number | string }[]
): number | null {
  let latestMessageId: number | null = null;

  for (const message of messages) {
    const numericId = toNumericMessageId(message.id);
    if (numericId === null) {
      continue;
    }

    latestMessageId =
      latestMessageId === null
        ? numericId
        : Math.max(latestMessageId, numericId);
  }

  return latestMessageId;
}
