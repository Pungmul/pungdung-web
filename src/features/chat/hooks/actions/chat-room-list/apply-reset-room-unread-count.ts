import type { QueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../../queries";
import { patchUnreadCountResetInRoomList } from "../../../services/chat-room-list/patch-unread-count-reset-in-room-list.service";
import { resetUnreadCountInRoomListIndexedDB } from "../../../services/chat-room-list/reset-unread-count-in-room-list-indexed-db.service";
import type { ChatRoomListItem } from "../../../types";

/**
 * room list React Query 캐시와 IndexedDB에서 대상 방 unreadCount를 0으로 맞춘다.
 */
export async function applyResetRoomUnreadCount(
  queryClient: QueryClient,
  roomId: string
): Promise<void> {
  const listKey = chatQueries.roomList().queryKey;
  const prev = queryClient.getQueryData<ChatRoomListItem[]>(listKey);

  if (prev?.length) {
    const roomExists = prev.some((room) => room.chatRoomUUID === roomId);
    if (!roomExists) {
      await queryClient.invalidateQueries({ queryKey: listKey });
    } else {
      const { next, changed } = patchUnreadCountResetInRoomList(prev, roomId);
      if (changed) {
        queryClient.setQueryData<ChatRoomListItem[]>(listKey, next);
      }
    }
  }

  await resetUnreadCountInRoomListIndexedDB(roomId);
}
