"use client";

import { useCallback, useLayoutEffect } from "react";

import { useMessageList } from "./useMessageList";
import { usePendingMessages } from "./usePendingMessages";
import { removePendingMatchedBySocketTextEcho } from "../../services/socket-chat-incoming.service";
import { useChatRoomSocket } from "../../socket/useChatRoomSocket";
import type {
  ChatRoomOutgoingMessageHandlers,
  Message,
  PendingMessage,
} from "../../types";
import { useChatRoomMessagesIndexedDB } from "../state/useChatRoomMessagesIndexedDB";

export type UseChatRoomMessageListParams = {
  roomId: string;
  myInfo?: { username: string };
  readSign: () => void;
};

/**
 * 방 메시지 타임라인 단일 조립:
 * - **query**, **socket**, **pending**을 한곳에서 묶어 `messageList`로 보냅니다.
 * - pending enqueue/성공·실패 반영은 `outgoingMessageHandlers`로 노출하고,
 *   전송(뮤테이션)·invalidate·읽음 처리는 `useSendMessageAction`에서 합니다.
 */
export function useChatRoomMessageList({
  roomId,
  myInfo,
  readSign,
}: UseChatRoomMessageListParams) {
  const { cachedMessages, roomQuery, roomInfiniteQuery, hydrated } =
    useChatRoomMessagesIndexedDB(roomId);
  const chatRoomData = roomQuery.data;
  const infiniteData = roomInfiniteQuery.data;

  const {
    pendingMessages,
    setPendingMessages,
    enqueueText,
    enqueueImage,
    requeueTextFailedAtEnd,
    requeueImageFailedAtEnd,
    removeById,
    failById,
    dismiss,
  } = usePendingMessages();

  const syncPendingOnSocketEcho = useCallback(
    (socketMessage: Message) => {
      const username = myInfo?.username;
      if (!username) return;
      setPendingMessages((p) =>
        removePendingMatchedBySocketTextEcho(p, socketMessage, username)
      );
      readSign();
    },
    [myInfo?.username, setPendingMessages, readSign]
  );

  const { socketMessages, replaceSocketBuffer } = useChatRoomSocket({
    roomId,
    onSocketMessageAppended: syncPendingOnSocketEcho,
  });

  useLayoutEffect(() => {
    replaceSocketBuffer([]);
    setPendingMessages([]);
  }, [roomId, replaceSocketBuffer, setPendingMessages]);

  const senderUsername = myInfo?.username ?? "";

  const beginTextSend = useCallback(
    (content: string) => {
      const pendingMsg = enqueueText({
        senderUsername,
        content,
        chatRoomUUID: roomId,
      });
      return String(pendingMsg.id);
    },
    [roomId, senderUsername, enqueueText]
  );

  const commitTextSendSuccess = useCallback(
    (pendingId: string) => {
      removeById(pendingId);
    },
    [removeById]
  );

  const commitTextSendFailure = useCallback(
    (pendingId: string) => {
      failById(pendingId);
    },
    [failById]
  );

  const beginImageSend = useCallback(
    (files: FileList) => {
      const pendingMsg = enqueueImage({
        senderUsername,
        files,
        chatRoomUUID: roomId,
      });
      return String(pendingMsg.id);
    },
    [roomId, senderUsername, enqueueImage]
  );

  const commitImageSendSuccess = useCallback(
    (pendingId: string) => {
      removeById(pendingId);
    },
    [removeById]
  );

  const commitImageSendFailure = useCallback(
    (pendingId: string) => {
      failById(pendingId);
    },
    [failById]
  );

  const beginRetryTextSend = useCallback(
    (failed: PendingMessage) => {
      const fresh = requeueTextFailedAtEnd(failed);
      return fresh ? String(fresh.id) : null;
    },
    [requeueTextFailedAtEnd]
  );

  const beginRetryImageSend = useCallback(
    (failed: PendingMessage, files: FileList) => {
      const fresh = requeueImageFailedAtEnd(failed, files);
      return fresh ? String(fresh.id) : null;
    },
    [requeueImageFailedAtEnd]
  );

  const outgoingMessageHandlers: ChatRoomOutgoingMessageHandlers = {
    beginTextSend,
    commitTextSendSuccess,
    commitTextSendFailure,
    beginImageSend,
    commitImageSendSuccess,
    commitImageSendFailure,
    beginRetryTextSend,
    beginRetryImageSend,
  };

  const messageList = useMessageList({
    cachedMessages,
    socketMessages,
    pendingMessages,
    ...(chatRoomData !== undefined ? { chatRoomData } : {}),
    ...(infiniteData !== undefined ? { infiniteData } : {}),
  });

  return {
    messageList,
    chatRoomData,
    infiniteData,
    isChatRoomLoading: !hydrated || roomQuery.isLoading,
    isInfiniteLoading: !hydrated || roomInfiniteQuery.isLoading,
    fetchNextPage: roomInfiniteQuery.fetchNextPage,
    hasNextPage: roomInfiniteQuery.hasNextPage,
    isFetchingNextPage: roomInfiniteQuery.isFetchingNextPage,
    socketMessages,
    outgoingMessageHandlers,
    onDeleteMessage: dismiss,
  };
}
