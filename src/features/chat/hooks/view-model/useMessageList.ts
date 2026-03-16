import { useMemo } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { mergeChatMessagesForRender } from "../../services";
import type {
  ChatLogCursorPage,
  Message,
} from "../../types/domain/chat-message.types";
import type { ChatRoom } from "../../types/domain/chat-room.types";
import type { PendingMessage } from "../../types/pending-message.types";

interface UseMessageListProps {
  cachedMessages?: Message[];
  chatRoomData?: ChatRoom;
  infiniteData?: InfiniteData<ChatLogCursorPage, unknown> | undefined;
  socketMessages: Message[];
  pendingMessages?: PendingMessage[];
}

export const useMessageList = ({
  cachedMessages,
  chatRoomData,
  infiniteData,
  socketMessages,
  pendingMessages = [],
}: UseMessageListProps) => {
  return useMemo(
    () =>
      mergeChatMessagesForRender({
        ...(cachedMessages !== undefined ? { cachedMessages } : {}),
        ...(chatRoomData !== undefined ? { chatRoomData } : {}),
        ...(infiniteData !== undefined ? { infiniteData } : {}),
        socketMessages,
        pendingMessages,
      }),
    [
      cachedMessages,
      chatRoomData,
      infiniteData,
      socketMessages,
      pendingMessages,
    ]
  );
};
