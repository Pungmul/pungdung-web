import type { ChatRoomListItem } from "../types";

/** room list(소켓·API·IDB)에서 방별 unreadCount를 조회한다. */
export function resolveUnreadCountFromRoomList(
  rooms: readonly ChatRoomListItem[] | undefined,
  roomId: string
): number | null {
  const room = rooms?.find((item) => item.chatRoomUUID === roomId);
  if (!room) {
    return null;
  }

  return room.unreadCount ?? null;
}
