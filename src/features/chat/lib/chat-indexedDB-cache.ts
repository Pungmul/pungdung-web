import { mapChatRoomListItemIndexedDBToDomain } from "./mappers";
import { patchChatRoomLocalOverride } from "../services/chat-room-local-override.service";
import type {
  ChatRoomLocalOverridePatch,
  ChatRoomLocalOverridesCacheRecord,
  ChatRoomListCacheRecord,
  ChatRoomMessagesCacheRecord,
  Message,
} from "../types";
import { CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY } from "../types";

const DB_NAME = "pungdung-chat-cache";
const DB_VERSION = 1;
const STORE_NAME = "chat-cache";
const CHAT_ROOM_LIST_CACHE_UPDATED_EVENT = "chat-room-list-cache-updated";
const CHAT_ROOM_LOCAL_OVERRIDES_UPDATED_EVENT =
  "chat-room-local-overrides-updated";

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDB(): Promise<IDBDatabase | null> {
  if (!isBrowser()) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T | undefined> {
  const db = await openDB();
  if (!db) return undefined;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = fn(store);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getChatRoomListCache() {
  const record = await withStore<ChatRoomListCacheRecord | undefined>(
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
  const result = await withStore<IDBValidKey>("readwrite", (store) =>
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
  const record = await withStore<ChatRoomLocalOverridesCacheRecord | undefined>(
    "readonly",
    (store) => store.get(CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY)
  );

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
  const result = await withStore<IDBValidKey>("readwrite", (store) =>
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

export async function updateChatRoomLocalOverride(
  roomId: string,
  patch: ChatRoomLocalOverridePatch
) {
  const current = await getChatRoomLocalOverridesCache();
  const overrides = { ...(current?.overrides ?? {}) };
  const nextOverride = patchChatRoomLocalOverride(overrides[roomId], patch);

  if (!nextOverride) {
    delete overrides[roomId];
  } else {
    overrides[roomId] = nextOverride;
  }

  return setChatRoomLocalOverridesCache({
    key: CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY,
    overrides,
    updatedAt: Date.now(),
  });
}

export function subscribeChatRoomLocalOverridesCacheUpdated(
  listener: (record: ChatRoomLocalOverridesCacheRecord) => void
) {
  if (!isBrowser()) return () => {};

  const handler = (event: Event) => {
    const customEvent =
      event as CustomEvent<ChatRoomLocalOverridesCacheRecord>;
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

export async function getChatRoomMessagesCache(roomId: string) {
  // room message cache key는 방 단위로 분리해 충돌 없이 독립 보관한다.
  const record = await withStore<ChatRoomMessagesCacheRecord | undefined>(
    "readonly",
    (store) => store.get(`chat-room-messages:${roomId}`)
  );

  if (!record) return undefined;

  // 과거 캐시 포맷(list)과 현재 포맷(messages)을 모두 수용해
  // 캐시 읽기 시 런타임 오류를 방지한다.
  const unsafeRecord = record as ChatRoomMessagesCacheRecord & {
    list?: Message[];
  };
  const normalizedMessages = Array.isArray(unsafeRecord.messages)
    ? unsafeRecord.messages
    : Array.isArray(unsafeRecord.list)
    ? unsafeRecord.list
    : [];

  return {
    ...record,
    messages: normalizedMessages,
  };
}

export async function setChatRoomMessagesCache(
  record: ChatRoomMessagesCacheRecord
) {
  return withStore<IDBValidKey>("readwrite", (store) => store.put(record));
}
