import { ChatRoomListItemDto } from "../types";

export function sortChatRoomByDate(chatRooms: ChatRoomListItemDto[]) {
  return chatRooms.sort(
    (a: ChatRoomListItemDto, b: ChatRoomListItemDto) =>
      new Date(b.lastMessageTime ?? "").getTime() -
      new Date(a.lastMessageTime ?? "").getTime()
  );
}
