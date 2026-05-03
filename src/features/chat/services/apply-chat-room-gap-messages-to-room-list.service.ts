import { sortChatRoomByDate } from "../lib";

import { resolveNewestGapMessagePreview } from "./resolve-newest-gap-message-preview.service";
import { updateLastMessageInRoomList } from "./update-last-message-in-room-list.service";
import type { ChatRoomListItem, Message } from "../types";

export function applyChatRoomGapMessagesToRoomList(
  prev: ChatRoomListItem[] | undefined,
  roomId: string,
  gapMessages: readonly Message[]
): ChatRoomListItem[] | undefined {
  if (!prev?.length || gapMessages.length === 0) {
    return prev;
  }

  const preview = resolveNewestGapMessagePreview(gapMessages);
  if (!preview) {
    return prev;
  }

  return sortChatRoomByDate(
    updateLastMessageInRoomList(
      prev,
      roomId,
      preview.content,
      preview.createdAt
    )
  );
}
