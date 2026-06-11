import type { ChatRoomListItem } from "../../types";

export function sortChatRoomByDate(chatRooms: ChatRoomListItem[]) {
  return [...chatRooms].sort(
    (a: ChatRoomListItem, b: ChatRoomListItem) =>
      new Date(b.lastMessageTime ?? "").getTime() -
      new Date(a.lastMessageTime ?? "").getTime()
  );
}
