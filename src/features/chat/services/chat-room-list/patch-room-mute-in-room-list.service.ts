import { getChatRoomListCache, setChatRoomListCache } from "../../lib";
import type { ChatRoomListItem } from "../../types";
import { CHAT_ROOM_LIST_CACHE_KEY } from "../../types";

/**
 * room list 스냅샷에서 대상 방의 `isMuted`만 바꾼 다음 상태를 계산합니다.
 * React Query 캐시 반영(`setQueryData`)은 호출부에서 합니다.
 */
export function patchRoomMuteInRoomList(
  rooms: readonly ChatRoomListItem[],
  roomId: string,
  muted: boolean
): { next: ChatRoomListItem[]; changed: boolean } {
  let changed = false;
  const next = rooms.map((room) => {
    if (room.chatRoomUUID !== roomId) {
      return room;
    }
    if (room.isMuted === muted) {
      return room;
    }
    changed = true;
    return { ...room, isMuted: muted };
  });

  return { next, changed };
}

export async function patchRoomMuteInRoomListIndexedDB(
  roomId: string,
  muted: boolean
): Promise<void> {
  const record = await getChatRoomListCache();
  if (!record?.rooms?.length) {
    return;
  }

  const { next, changed } = patchRoomMuteInRoomList(
    record.rooms,
    roomId,
    muted
  );
  if (!changed) {
    return;
  }

  await setChatRoomListCache({
    key: CHAT_ROOM_LIST_CACHE_KEY,
    rooms: next,
    updatedAt: record.updatedAt,
    validatedAt: record.validatedAt ?? Date.now(),
  });
}
