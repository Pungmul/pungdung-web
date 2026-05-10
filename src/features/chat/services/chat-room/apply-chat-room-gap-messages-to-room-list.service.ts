import { sortChatRoomByDate } from "../../lib";
import type { ChatRoomListItem, Message } from "../../types";
import { updateLastMessageInRoomList } from "../chat-room-list/update-last-message-in-room-list.service";
import { resolveNewestGapMessagePreview } from "../message/resolve-newest-gap-message-preview.service";

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
