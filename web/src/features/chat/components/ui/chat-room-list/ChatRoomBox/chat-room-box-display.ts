import { chatRoomTypeLabel, chatRoomVisibleMemberCount } from "../../../../lib/chat-room/chat-room-type-label";
import type { ChatRoomListItem, ChatRoomType } from "../../../../types";

export function chatRoomBoxTypeLabel(type: ChatRoomType) {
  return chatRoomTypeLabel(type);
}

export function chatRoomBoxMemberCount(
  room: Pick<ChatRoomListItem, "type" | "group" | "chatRoomMemberIds">
) {
  return chatRoomVisibleMemberCount(
    room.type,
    room.group,
    room.chatRoomMemberIds.length,
  );
}
