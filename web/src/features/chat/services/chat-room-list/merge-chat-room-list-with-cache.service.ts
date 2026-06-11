import { sortChatRoomByDate } from "../../lib";
import type { ChatRoomListItem } from "../../types";

export function mergeChatRoomListWithCache(
  cached: ChatRoomListItem[],
  queried: ChatRoomListItem[]
): ChatRoomListItem[] {
  // 동일 roomId 기준으로 서버 응답이 캐시를 덮어쓰도록 순서를 고정한다.
  const byRoomId = new Map<string, ChatRoomListItem>();

  for (const room of cached) {
    byRoomId.set(room.chatRoomUUID, room);
  }

  for (const room of queried) {
    byRoomId.set(room.chatRoomUUID, room);
  }

  return sortChatRoomByDate(Array.from(byRoomId.values()));
}
