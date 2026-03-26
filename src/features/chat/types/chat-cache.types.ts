import type { Message } from "./domain/chat-message.types";
import type { ChatRoomListItem } from "./domain/chat-room.types";

export const CHAT_ROOM_LIST_CACHE_KEY = "chat-room-list";
export const CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX = "chat-room-messages:";
export const CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY = "chat-room-local-overrides";

export interface ChatRoomLocalOverride {
  roomName?: string;
  profileImageUrl?: string | null;
}

export interface ChatRoomLocalOverridePatch {
  roomName?: string | undefined;
  profileImageUrl?: string | null | undefined;
}

export interface ChatRoomLocalOverridesCacheRecord {
  key: typeof CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY;
  overrides: Record<string, ChatRoomLocalOverride>;
  updatedAt: number;
}

export interface ChatRoomListCacheRecord {
  key: typeof CHAT_ROOM_LIST_CACHE_KEY;
  rooms: ChatRoomListItem[];
  updatedAt: number;
  validatedAt?: number;
}

export interface ChatRoomMessagesCacheRecord {
  key: string;
  roomId: string;
  messages: Message[];
  updatedAt: number;
  validatedAt?: number;
  oldestCursor: number | null;
  newestMessageId: string | null;
}
