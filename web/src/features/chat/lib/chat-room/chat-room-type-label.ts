import type { ChatRoomType } from "../../types";

const CHAT_ROOM_TYPE_LABEL = {
  LIGHTNING: "번개",
  PERFORMANCE: "공연",
} as const satisfies Record<Exclude<ChatRoomType, "NORMAL">, string>;

export function chatRoomTypeLabel(type: ChatRoomType) {
  if (type === "NORMAL") return null;
  return CHAT_ROOM_TYPE_LABEL[type];
}

export function chatRoomVisibleMemberCount(
  type: ChatRoomType,
  group: boolean,
  memberCount: number,
) {
  if (type === "NORMAL" && !group) return null;
  if (memberCount <= 0) return null;
  return memberCount;
}
