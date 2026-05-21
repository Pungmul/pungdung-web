import { patchUnreadCountResetInRoomList } from "./patch-unread-count-reset-in-room-list.service";
import { getChatRoomListCache, setChatRoomListCache } from "../../lib";
import { CHAT_ROOM_LIST_CACHE_KEY } from "../../types";

export async function resetUnreadCountInRoomListIndexedDB(
  roomId: string
): Promise<void> {
  const record = await getChatRoomListCache();
  if (!record?.rooms?.length) {
    return;
  }

  const { next, changed } = patchUnreadCountResetInRoomList(
    record.rooms,
    roomId
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
