"use client";

import { useLayoutEffect, useRef } from "react";

import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";

import { chatQueries } from "../queries";

import { useChatRoomSocketMessages } from "./useChatRoomSocketMessages";
import { useMessageList } from "./useMessageList";
import {
  usePendingMessages,
  type UsePendingMessagesParams,
} from "./usePendingMessages";
import { removePendingMatchedBySocketTextEcho } from "../services/socket-chat-incoming.service";

type UseChatRoomMessageListParams = Omit<
  UsePendingMessagesParams,
  "senderUsername" | "onMessageSuccess"
> & {
  myInfo?: { username: string };
  readSign: () => void;
};

/**
 * 방 메시지 타임라인 단일 조립:
 * - **query**, **socket**, **pending**(전송/재시도)을 한곳에서 묶어 `messageList`로 내보냅니다.
 */
export function useChatRoomMessageList({
  roomId,
  myInfo,
  readSign,
  sendTextMessageMutation,
  sendImageMessageMutation,
  onMessageSent,
}: UseChatRoomMessageListParams) {
  const { data: chatRoomData, isLoading: isChatRoomLoading } = useSuspenseQuery(
    chatQueries.room(roomId)
  );
  const {
    data: infiniteData,
    isLoading: isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(chatQueries.roomInfinite(roomId));

  const { socketMessages, replaceSocketBuffer, socketAppendForPendingRef } =
    useChatRoomSocketMessages({
      roomId,
      readSign,
    });

  const {
    pendingMessages,
    setPendingMessages,
    onSendMessage,
    onSendImage,
    onDeleteMessage,
  } = usePendingMessages({
    roomId,
    senderUsername: myInfo?.username ?? "",
    sendTextMessageMutation,
    sendImageMessageMutation,
    onMessageSuccess: readSign,
    ...(onMessageSent !== undefined ? { onMessageSent } : {}),
  });

  const myUsernameRef = useRef(myInfo?.username);
  myUsernameRef.current = myInfo?.username;

  useLayoutEffect(() => {
    replaceSocketBuffer([]);
  }, [roomId, replaceSocketBuffer]);

  useLayoutEffect(() => {
    const added = socketAppendForPendingRef.current;
    socketAppendForPendingRef.current = null;
    const username = myUsernameRef.current;
    if (added !== null && username) {
      setPendingMessages((p) =>
        removePendingMatchedBySocketTextEcho(p, added, username)
      );
    }
  }, [socketMessages, socketAppendForPendingRef, setPendingMessages]);

  const messageList = useMessageList({
    socketMessages,
    pendingMessages,
    ...(chatRoomData !== undefined ? { chatRoomData } : {}),
    ...(infiniteData !== undefined ? { infiniteData } : {}),
  });

  return {
    messageList,
    chatRoomData,
    infiniteData,
    isChatRoomLoading,
    isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    socketMessages,
    onSendMessage,
    onSendImage,
    onDeleteMessage,
  };
}
