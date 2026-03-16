import { useMemo } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { removePendingMessagesShadowedByConfirmed } from "../../services";
import type {
  ChatLogCursorPage,
  Message,
} from "../../types/domain/chat-message.types";
import type { ChatRoom } from "../../types/domain/chat-room.types";
import type { PendingMessage } from "../../types/pending-message.types";

interface UseMessageListProps {
  chatRoomData?: ChatRoom;
  infiniteData?: InfiniteData<ChatLogCursorPage, unknown> | undefined;
  socketMessages: Message[];
  pendingMessages?: PendingMessage[];
}

export const useMessageList = ({
  chatRoomData,
  infiniteData,
  socketMessages,
  pendingMessages = [],
}: UseMessageListProps) => {
  return useMemo(() => {
    const messageMap = new Map<string, Message>();

    if (infiniteData?.pages) {
      for (const page of infiniteData.pages) {
        if (page?.messages) {
          for (const msg of page.messages) {
            messageMap.set(String(msg.id), msg);
          }
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

    // pending은 `YYYY-MM-DD HH:mm:ss`, 서버는 ISO 등 다른 형식일 수 있어
    // `localeCompare`만으로는 최신 말풍선 아래에 고정되지 않는다. 전송 큐는 항상 하단.
    const visiblePendingMessages = removePendingMessagesShadowedByConfirmed(
      pendingMessages,
      sortedConfirmed
    );

    return [...sortedConfirmed, ...visiblePendingMessages];
  }, [chatRoomData, infiniteData, socketMessages, pendingMessages]);
};
