import { useMemo } from "react";

import { InfiniteData } from "@tanstack/react-query";

import type {
  ChatRoomDto,
  Message,
  MessageList,
  PendingMessage,
} from "../types";

interface UseMessageListProps {
  chatRoomData?: ChatRoomDto;
  infiniteData?: InfiniteData<MessageList, unknown> | undefined;
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
    const messageMap = new Map<string, Message | PendingMessage>();

    if (infiniteData?.pages) {
      for (const page of infiniteData.pages) {
        if (page?.list) {
          for (const msg of page.list) {
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
    return [...sortedConfirmed, ...pendingMessages];
  }, [chatRoomData, infiniteData, socketMessages, pendingMessages]);
};
