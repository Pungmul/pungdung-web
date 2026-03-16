import type { Message } from "./domain/chat-message.types";
import type { ChatRoomListItem } from "./domain/chat-room.types";

export const CHAT_ROOM_LIST_CACHE_KEY = "chat-room-list";
export const CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX = "chat-room-messages:";

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
