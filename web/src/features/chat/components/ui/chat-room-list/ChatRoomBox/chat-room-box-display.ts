import type { ChatRoomListItem, ChatRoomType } from "../../../../types";

const CHAT_ROOM_TYPE_LABEL = {
  LIGHTNING: "번개",
  PERFORMANCE: "공연",
} as const satisfies Record<Exclude<ChatRoomType, "NORMAL">, string>;

export function chatRoomBoxTypeLabel(type: ChatRoomType) {
  if (type === "NORMAL") return null;
  return CHAT_ROOM_TYPE_LABEL[type];
}

export function chatRoomBoxMemberCount(
  room: Pick<ChatRoomListItem, "type" | "group" | "chatRoomMemberIds">
) {
  if (room.type === "NORMAL" && !room.group) return null;
  return room.chatRoomMemberIds.length;
}
