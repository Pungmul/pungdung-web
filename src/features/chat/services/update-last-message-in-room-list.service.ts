import type { ChatRoomListItem } from "../types/chat-room.types";

export const updateLastMessageInRoomList = (
  rooms: ChatRoomListItem[],
  roomId: string,
  lastMessageContent: string,
  lastMessageTime: string
): ChatRoomListItem[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId
      ? { ...room, lastMessageContent, lastMessageTime }
      : room
  );
};
