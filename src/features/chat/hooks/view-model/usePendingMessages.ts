"use client";

import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  createPendingImageMessage,
  createPendingTextMessage,
  removePendingMessage,
  updateMessageToFailed,
} from "../../services";
import type { PendingMessage } from "../../types";

type EnqueuePendingTextParams = Parameters<typeof createPendingTextMessage>[0];
type EnqueuePendingImageParams = Parameters<
  typeof createPendingImageMessage
>[0];

interface UsePendingMessagesReturn {
  pendingMessages: PendingMessage[];
  setPendingMessages: Dispatch<SetStateAction<PendingMessage[]>>;
  enqueueText: (params: EnqueuePendingTextParams) => PendingMessage;
  enqueueImage: (params: EnqueuePendingImageParams) => PendingMessage;
  /** 실패한 텍스트 pending을 제거하고, 동일 내용의 새 pending을 큐 맨 뒤에 둡니다. */
  requeueTextFailedAtEnd: (failed: PendingMessage) => PendingMessage | null;
  /** 실패한 이미지 pending을 제거하고, 새 pending을 큐 맨 뒤에 둡니다. */
  requeueImageFailedAtEnd: (
    failed: PendingMessage,
    files: FileList
  ) => PendingMessage | null;
  removeById: (messageId: string | number) => void;
  failById: (messageId: string | number) => void;
  dismiss: (message: PendingMessage) => void;
}

/**
 * 전송 큐(pending / failed) 배열만 다룹니다. API·뮤테이션·토스트는 호출 측에서 처리합니다.
 */
export function usePendingMessages(): UsePendingMessagesReturn {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  const enqueueText = useCallback((params: EnqueuePendingTextParams) => {
    const msg = createPendingTextMessage(params);
    setPendingMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const enqueueImage = useCallback((params: EnqueuePendingImageParams) => {
    const msg = createPendingImageMessage(params);
    setPendingMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const requeueTextFailedAtEnd = useCallback((failed: PendingMessage) => {
    if (failed.chatType !== "TEXT" || failed.state !== "failed") return null;
    const content = failed.content ?? "";
    const fresh = createPendingTextMessage({
      senderUsername: failed.senderUsername,
      content,
      chatRoomUUID: failed.chatRoomUUID,
    });
    setPendingMessages((prev) => [
      ...removePendingMessage(prev, failed.id),
      fresh,
    ]);
    return fresh;
  }, []);

  const requeueImageFailedAtEnd = useCallback(
    (failed: PendingMessage, files: FileList) => {
      if (failed.chatType !== "IMAGE" || failed.state !== "failed") return null;
      for (const url of failed.imageUrlList ?? []) {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      }
      const fresh = createPendingImageMessage({
        senderUsername: failed.senderUsername,
        files,
        chatRoomUUID: failed.chatRoomUUID,
      });
      setPendingMessages((prev) => [
        ...removePendingMessage(prev, failed.id),
        fresh,
      ]);
      return fresh;
    },
    []
  );

  const removeById = useCallback((messageId: string | number) => {
    setPendingMessages((prev) => {
      const found = prev.find((m) => m.id === messageId);
      if (found?.chatType === "IMAGE") {
        for (const url of found.imageUrlList ?? []) {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        }
      }
      return removePendingMessage(prev, messageId);
    });
  }, []);

  const failById = useCallback((messageId: string | number) => {
    setPendingMessages((prev) => updateMessageToFailed(prev, messageId));
  }, []);

  const dismiss = useCallback((message: PendingMessage) => {
    if (message.chatType === "IMAGE") {
      for (const url of message.imageUrlList ?? []) {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      }
    }
    setPendingMessages((prev) => removePendingMessage(prev, message.id));
  }, []);

  return {
    pendingMessages,
    setPendingMessages,
    enqueueText,
    enqueueImage,
    requeueTextFailedAtEnd,
    requeueImageFailedAtEnd,
    removeById,
    failById,
    dismiss,
  };
}
