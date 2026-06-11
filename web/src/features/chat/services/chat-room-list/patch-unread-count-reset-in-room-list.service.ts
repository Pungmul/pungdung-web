import type { ChatRoomListItem } from "../../types/chat-room.types";

/**
 * room list 스냅샷에서 대상 방의 unreadCount만 0으로 만든 다음 상태를 계산합니다.
 * React Query 캐시 반영(`setQueryData`)은 호출부에서 합니다.
 */
export function patchUnreadCountResetInRoomList(
  rooms: readonly ChatRoomListItem[],
  roomId: string
): { next: ChatRoomListItem[]; changed: boolean } {
  let changed = false;
  const next = rooms.map((room) => {
    if (room.chatRoomUUID !== roomId) {
      return room;
    }
    if (room.unreadCount === 0) {
      return room;
    }
    changed = true;
    return { ...room, unreadCount: 0 };
  });

  return { next, changed };
}
