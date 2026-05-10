import { IMAGE_LAST_MESSAGE_PREVIEW } from "../../lib/message/image-last-message-preview";
import { mergeChatMessagesNewestFirst } from "../../lib/message/merge-chat-messages-newest-first";
import type { Message } from "../../types";

export function resolveNewestGapMessagePreview(
  gapMessages: readonly Message[]
): { content: string; createdAt: string } | null {
  const newest = mergeChatMessagesNewestFirst([], gapMessages)[0];
  if (!newest) {
    return null;
  }

  const content =
    newest.chatType === "IMAGE"
      ? IMAGE_LAST_MESSAGE_PREVIEW
      : newest.content ?? "";

  return { content, createdAt: newest.createdAt };
}
