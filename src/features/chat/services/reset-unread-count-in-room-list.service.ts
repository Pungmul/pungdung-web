import type { ChatRoomListItem } from "../types/chat-room.types";

export const resetUnreadCountInRoomList = (
  rooms: ChatRoomListItem[],
  roomId: string
): ChatRoomListItem[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
  );
};
