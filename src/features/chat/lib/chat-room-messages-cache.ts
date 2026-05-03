import { withChatCacheStore } from "./open-chat-cache-db";
import type { ChatRoomMessagesCacheRecord, Message } from "../types";

export async function getChatRoomMessagesCache(roomId: string) {
  const record = await withChatCacheStore<
    ChatRoomMessagesCacheRecord | undefined
  >("readonly", (store) => store.get(`chat-room-messages:${roomId}`));

  if (!record) return undefined;

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
  return withChatCacheStore<IDBValidKey>("readwrite", (store) =>
    store.put(record)
  );
}
