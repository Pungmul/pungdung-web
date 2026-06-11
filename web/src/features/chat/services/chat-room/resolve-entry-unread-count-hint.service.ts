import type { ChatRoomListItem } from "../../types";
import { resolveUnreadCountFromRoomList } from "../chat-room-list/resolve-unread-count-from-room-list.service";

/** 진입 스냅샷·초기 page size에 쓸 unread 힌트 — IDB room list와 query room list 중 큰 값 */
export function resolveEntryUnreadCountHint(
  listUnreadCountFromIdb: number | null,
  roomList: readonly ChatRoomListItem[] | undefined,
  roomId: string
): number {
  const unreadFromRoomList = resolveUnreadCountFromRoomList(roomList, roomId);

  return Math.max(listUnreadCountFromIdb ?? 0, unreadFromRoomList ?? 0);
}
