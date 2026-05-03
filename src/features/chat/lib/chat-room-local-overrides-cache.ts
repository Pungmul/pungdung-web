import { CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY } from "../types";

import { isBrowser, withChatCacheStore } from "./open-chat-cache-db";
import type {
  ChatRoomLocalOverridePatch,
  ChatRoomLocalOverridesCacheRecord,
} from "../types";

const CHAT_ROOM_LOCAL_OVERRIDES_UPDATED_EVENT =
  "chat-room-local-overrides-updated";

function normalizeLocalOverridesRecord(
  record: ChatRoomLocalOverridesCacheRecord | undefined
): ChatRoomLocalOverridesCacheRecord | undefined {
  if (!record) return undefined;

  return {
    key: CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY,
    overrides:
      record.overrides && typeof record.overrides === "object"
        ? record.overrides
        : {},
    updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : 0,
  };
}

export async function getChatRoomLocalOverridesCache() {
  const record = await withChatCacheStore<
    ChatRoomLocalOverridesCacheRecord | undefined
  >("readonly", (store) => store.get(CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY));

  return normalizeLocalOverridesRecord(record);
}

export async function setChatRoomLocalOverridesCache(
  record: ChatRoomLocalOverridesCacheRecord
) {
  const normalizedRecord = normalizeLocalOverridesRecord(record) ?? {
    key: CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY,
    overrides: {},
    updatedAt: Date.now(),
  };
  const result = await withChatCacheStore<IDBValidKey>("readwrite", (store) =>
    store.put(normalizedRecord)
  );

  if (isBrowser()) {
    window.dispatchEvent(
      new CustomEvent<ChatRoomLocalOverridesCacheRecord>(
        CHAT_ROOM_LOCAL_OVERRIDES_UPDATED_EVENT,
        {
          detail: normalizedRecord,
        }
      )
    );
  }

  return result;
}

export function subscribeChatRoomLocalOverridesCacheUpdated(
  listener: (record: ChatRoomLocalOverridesCacheRecord) => void
) {
  if (!isBrowser()) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ChatRoomLocalOverridesCacheRecord>;
    const normalizedRecord = normalizeLocalOverridesRecord(customEvent.detail);
    if (!normalizedRecord) return;
    listener(normalizedRecord);
  };

  window.addEventListener(CHAT_ROOM_LOCAL_OVERRIDES_UPDATED_EVENT, handler);
  return () => {
    window.removeEventListener(
      CHAT_ROOM_LOCAL_OVERRIDES_UPDATED_EVENT,
      handler
    );
  };
}

export type { ChatRoomLocalOverridePatch };
