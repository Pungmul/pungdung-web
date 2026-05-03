import { mapChatRoomListItemIndexedDBToDomain } from "./mappers";
import { isBrowser, withChatCacheStore } from "./open-chat-cache-db";
import type { ChatRoomListCacheRecord } from "../types";

const CHAT_ROOM_LIST_CACHE_UPDATED_EVENT = "chat-room-list-cache-updated";

export async function getChatRoomListCache() {
  const record = await withChatCacheStore<ChatRoomListCacheRecord | undefined>(
    "readonly",
    (store) => store.get("chat-room-list")
  );

  if (!record) return undefined;
  const rooms = Array.isArray(record.rooms) ? record.rooms : [];

  return {
    ...record,
    rooms: rooms.map(mapChatRoomListItemIndexedDBToDomain),
  };
}

export async function setChatRoomListCache(
  record: ChatRoomListCacheRecord,
  options?: { emitUpdatedEvent?: boolean }
) {
  const result = await withChatCacheStore<IDBValidKey>("readwrite", (store) =>
    store.put(record)
  );

  if (isBrowser() && options?.emitUpdatedEvent !== false) {
    window.dispatchEvent(
      new CustomEvent<ChatRoomListCacheRecord>(
        CHAT_ROOM_LIST_CACHE_UPDATED_EVENT,
        {
          detail: record,
        }
      )
    );
  }

  return result;
}

export function subscribeChatRoomListCacheUpdated(
  listener: (record: ChatRoomListCacheRecord) => void
) {
  if (!isBrowser()) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ChatRoomListCacheRecord>;
    const detail = customEvent.detail;
    if (!detail) return;
    const rooms = Array.isArray(detail.rooms) ? detail.rooms : [];
    listener({
      ...detail,
      rooms: rooms.map(mapChatRoomListItemIndexedDBToDomain),
    });
  };

  window.addEventListener(CHAT_ROOM_LIST_CACHE_UPDATED_EVENT, handler);
  return () => {
    window.removeEventListener(CHAT_ROOM_LIST_CACHE_UPDATED_EVENT, handler);
  };
}
