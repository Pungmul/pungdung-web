"use client";

import { useCallback } from "react";

import type {
  ChatRoomOutgoingMessageHandlers,
  PendingMessage,
} from "../../../types";

type UseOutgoingMessageHandlersParams = {
  roomId: string;
  senderUsername: string;
  enqueueText: (params: {
    senderUsername: string;
    content: string;
    chatRoomUUID: string;
  }) => PendingMessage;
  enqueueImage: (params: {
    senderUsername: string;
    files: FileList;
    chatRoomUUID: string;
  }) => PendingMessage;
  requeueTextFailedAtEnd: (failed: PendingMessage) => PendingMessage | null;
  requeueImageFailedAtEnd: (
    failed: PendingMessage,
    files: FileList
  ) => PendingMessage | null;
  removeById: (messageId: string | number) => void;
  failById: (messageId: string | number) => void;
};

/**
 * pending 메시지 큐 primitives를 ChatRoomOutgoingMessageHandlers 인터페이스로 조립합니다.
 * 전송(뮤테이션)·readSign·toast는 useSendMessageAction에서 처리합니다.
 */
export function useOutgoingMessageHandlers({
  roomId,
  senderUsername,
  enqueueText,
  enqueueImage,
  requeueTextFailedAtEnd,
  requeueImageFailedAtEnd,
  removeById,
  failById,
}: UseOutgoingMessageHandlersParams): ChatRoomOutgoingMessageHandlers {
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
    (pendingId: string) => removeById(pendingId),
    [removeById]
  );

  const commitTextSendFailure = useCallback(
    (pendingId: string) => failById(pendingId),
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
    (pendingId: string) => removeById(pendingId),
    [removeById]
  );

  const commitImageSendFailure = useCallback(
    (pendingId: string) => failById(pendingId),
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

  return {
    beginTextSend,
    commitTextSendSuccess,
    commitTextSendFailure,
    beginImageSend,
    commitImageSendSuccess,
    commitImageSendFailure,
    beginRetryTextSend,
    beginRetryImageSend,
  };
}
