"use client";

import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { chatQueries } from "../../queries";
import {
  createPendingImageMessage,
  createPendingTextMessage,
  removePendingMessage,
  updateMessageToFailed,
} from "../../services";
import { PendingMessage } from "../../types";

export interface UsePendingMessagesParams {
  roomId: string;
  senderUsername: string;
  sendTextMessageMutation: {
    mutate: (
      params: { roomId: string; message: { content: string } },
      options?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => void;
  };
  sendImageMessageMutation: {
    mutate: (
      params: { roomId: string; formData: FormData },
      options?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => void;
  };
  onMessageSent?: () => void;
  onMessageSuccess?: () => void;
}

interface UsePendingMessagesReturn {
  pendingMessages: PendingMessage[];
  setPendingMessages: React.Dispatch<React.SetStateAction<PendingMessage[]>>;
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
  onDeleteMessage: (message: PendingMessage) => void;
}

/**
 * pending 메시지 상태와 전송 로직을 관리하는 훅
 *
 * @param params - 훅 설정 파라미터
 * @returns pending 메시지 관련 상태와 핸들러들
 *
 * @example
 * const {
 *   pendingMessages,
 *   onSendMessage,
 *   onSendImage,
 *   onDeleteMessage
 * } = usePendingMessages({
 *   roomId: "room-123",
 *   senderUsername: "user1",
 *   sendTextMessageMutation,
 *   sendImageMessageMutation,
 *   onMessageSent: () => scrollToTop()
 * });
 */
export const usePendingMessages = ({
  roomId,
  senderUsername,
  sendTextMessageMutation,
  sendImageMessageMutation,
  onMessageSent,
  onMessageSuccess,
}: UsePendingMessagesParams): UsePendingMessagesReturn => {
  const queryClient = useQueryClient();
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  const onSendMessage = useCallback(
    async (message: string) => {
      const pendingMsg = createPendingTextMessage({
        senderUsername,
        content: message,
        chatRoomUUID: roomId,
      });
      const pendingId = pendingMsg.id;

      setPendingMessages((prev) => [...prev, pendingMsg]);
      onMessageSent?.();

      try {
        sendTextMessageMutation.mutate(
          {
            roomId,
            message: { content: message },
          },
          {
            onSuccess: () => {
              setPendingMessages((prev) =>
                removePendingMessage(prev, pendingId)
              );
              void queryClient.invalidateQueries({
                queryKey: chatQueries.room(roomId).queryKey,
              });
              onMessageSuccess?.();
            },
            onError: () => {
              setPendingMessages((prev) =>
                updateMessageToFailed(prev, pendingId)
              );
            },
          }
        );
      } catch {
        Toast.show({
          message: "채팅 전송에 실패했습니다.",
          type: "error",
        });
        setPendingMessages((prev) => updateMessageToFailed(prev, pendingId));
      }
    },
    [
      roomId,
      senderUsername,
      sendTextMessageMutation,
      queryClient,
      onMessageSent,
      onMessageSuccess,
    ]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      const pendingMsg = createPendingImageMessage({
        senderUsername,
        files,
        chatRoomUUID: roomId,
      });
      const pendingId = pendingMsg.id;

      setPendingMessages((prev) => [...prev, pendingMsg]);
      onMessageSent?.();

      try {
        const formData = new FormData();
        if (!files) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });

        sendImageMessageMutation.mutate(
          {
            roomId,
            formData,
          },
          {
            onSuccess: () => {
              setPendingMessages((prev) =>
                removePendingMessage(prev, pendingId)
              );
              void queryClient.invalidateQueries({
                queryKey: chatQueries.room(roomId).queryKey,
              });
              onMessageSuccess?.();
            },
            onError: () => {
              setPendingMessages((prev) =>
                updateMessageToFailed(prev, pendingId)
              );
            },
          }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `채팅 전송에 실패했습니다.\n${error.message}`
            : "채팅 전송에 실패했습니다.";

        Toast.show({
          message: errorMessage,
          type: "error",
        });
        setPendingMessages((prev) => updateMessageToFailed(prev, pendingId));
      }
    },
    [
      roomId,
      senderUsername,
      sendImageMessageMutation,
      queryClient,
      onMessageSent,
      onMessageSuccess,
    ]
  );

  const onDeleteMessage = useCallback((message: PendingMessage) => {
    setPendingMessages((prev) => removePendingMessage(prev, message.id));
  }, []);

  return {
    pendingMessages,
    setPendingMessages,
    onSendMessage,
    onSendImage,
    onDeleteMessage,
  };
};
