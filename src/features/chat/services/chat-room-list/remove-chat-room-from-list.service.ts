import type { ChatRoomListItem } from "../../types/chat-room.types";

export const removeChatRoomFromList = (
  rooms: ChatRoomListItem[],
  roomId: string
): ChatRoomListItem[] => {
  return rooms.filter((room) => room.chatRoomUUID !== roomId);
};
