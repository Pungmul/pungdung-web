import type { InfiniteData } from "@tanstack/react-query";

import { removePendingMessagesShadowedByConfirmed } from "./reconcile-pending-messages.service";
import type {
  ChatLogCursorPage,
  ChatRoom,
  Message,
  PendingMessage,
} from "../types";

interface MergeChatMessagesForRenderParams {
  cachedMessages?: Message[];
  chatRoomData?: ChatRoom;
  infiniteData?: InfiniteData<ChatLogCursorPage, unknown>;
  socketMessages: Message[];
  pendingMessages?: PendingMessage[];
}

export function mergeChatMessagesForRender({
  cachedMessages = [],
  chatRoomData,
  infiniteData,
  socketMessages,
  pendingMessages = [],
}: MergeChatMessagesForRenderParams) {
  const messageMap = new Map<string, Message>();

  for (const msg of cachedMessages) {
    messageMap.set(String(msg.id), msg);
  }

  if (infiniteData?.pages) {
    for (const page of infiniteData.pages) {
      for (const msg of page.messages ?? []) {
        messageMap.set(String(msg.id), msg);
      }
    }
  }

  if (chatRoomData?.messageList?.list) {
    for (const msg of chatRoomData.messageList.list) {
      messageMap.set(String(msg.id), msg);
    }
  }

  for (const msg of socketMessages) {
    messageMap.set(String(msg.id), msg);
  }

  const sortedConfirmed = Array.from(messageMap.values()).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  const visiblePendingMessages = removePendingMessagesShadowedByConfirmed(
    pendingMessages,
    sortedConfirmed
  );

  return [...sortedConfirmed, ...visiblePendingMessages];
}
