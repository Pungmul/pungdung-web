import type { ReadReceiptAvatar } from "../../types/read-receipt.types";
import type { ReadReceiptDisplayContext } from "../../types/read-receipt-display.types";

export function getReadReceiptAvatarsForMessage(
  context: ReadReceiptDisplayContext,
  messageId: number,
  messageSenderUsername?: string
): ReadReceiptAvatar[] {
  if (context.mode !== "group") {
    return [];
  }

  const avatars = context.avatarsByMessageId.get(messageId) ?? [];

  if (!messageSenderUsername) {
    return avatars;
  }

  return avatars.filter((avatar) => avatar.username !== messageSenderUsername);
}
