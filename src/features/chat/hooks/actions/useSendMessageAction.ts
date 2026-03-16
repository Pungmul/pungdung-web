"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { chatMutationOptions, chatQueries } from "../../queries";
import { fileListFromBlobObjectUrls } from "../../services/file-list-from-object-urls.service";
import type {
  ChatRoomOutgoingMessageHandlers,
  PendingMessage,
} from "../../types";

export type UseSendMessageActionParams = {
  roomId: string;
  readSign: () => void;
  outgoingMessageHandlers: ChatRoomOutgoingMessageHandlers;
  onMessageSent?: () => void;
};

export function useSendMessageAction({
  roomId,
  readSign,
  outgoingMessageHandlers,
  onMessageSent,
}: UseSendMessageActionParams) {
  const queryClient = useQueryClient();
  const sendTextMessageMutation = useMutation(
    chatMutationOptions.sendTextMessage()
  );
  const sendImageMessageMutation = useMutation(
    chatMutationOptions.sendImageMessage()
  );

  const {
    beginTextSend,
    commitTextSendFailure,
    beginImageSend,
    commitImageSendFailure,
    beginRetryTextSend,
    beginRetryImageSend,
  } = outgoingMessageHandlers;

  const invalidateRoom = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: chatQueries.room(roomId).queryKey,
    });
  }, [queryClient, roomId]);

  const submitTextWithPendingId = useCallback(
    (pendingId: string, content: string) => {
      try {
        sendTextMessageMutation.mutate(
          { roomId, message: { content, clientId: pendingId } },
          {
            onSuccess: () => {
              // pending 제거는 소켓 echo에서만 한다(로컬 state와 한 커밋).
              // 여기서 remove 하면 API·invalidate·소켓 타이밍 차로 말풍선이 비는 프레임이 난다.
              invalidateRoom();
              readSign();
            },
            onError: () => {
              commitTextSendFailure(pendingId);
            },
          }
        );
      } catch {
        Toast.show({
          message: "채팅 전송에 실패했습니다.",
          type: "error",
        });
        commitTextSendFailure(pendingId);
      }
    },
    [
      roomId,
      sendTextMessageMutation,
      commitTextSendFailure,
      invalidateRoom,
      readSign,
    ]
  );

  const onSendMessage = useCallback(
    async (message: string) => {
      const pendingId = beginTextSend(message);
      onMessageSent?.();
      submitTextWithPendingId(pendingId, message);
    },
    [beginTextSend, onMessageSent, submitTextWithPendingId]
  );

  const onRetryTextFailed = useCallback(
    (failed: PendingMessage) => {
      const pendingId = beginRetryTextSend(failed);
      if (!pendingId) return;
      onMessageSent?.();
      submitTextWithPendingId(pendingId, failed.content ?? "");
    },
    [beginRetryTextSend, onMessageSent, submitTextWithPendingId]
  );

  const submitImageWithPendingId = useCallback(
    (pendingId: string, files: FileList) => {
      try {
        const formData = new FormData();
        if (!files || files.length === 0) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
        formData.append("clientId", pendingId);

        sendImageMessageMutation.mutate(
          { roomId, formData },
          {
            onSuccess: () => {
              // pending 제거는 확정 메시지가 query/socket에 반영된 뒤 view-model에서 처리한다.
              // API success 직후 제거하면 confirmed 반영 전 빈 프레임이 생긴다.
              invalidateRoom();
              readSign();
            },
            onError: () => {
              commitImageSendFailure(pendingId);
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
        commitImageSendFailure(pendingId);
      }
    },
    [
      roomId,
      sendImageMessageMutation,
      commitImageSendFailure,
      invalidateRoom,
      readSign,
    ]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      const pendingId = beginImageSend(files);
      onMessageSent?.();
      submitImageWithPendingId(pendingId, files);
    },
    [beginImageSend, onMessageSent, submitImageWithPendingId]
  );

  const onRetryImageFailed = useCallback(
    async (failed: PendingMessage) => {
      const urls = failed.imageUrlList ?? [];
      const files = await fileListFromBlobObjectUrls(urls);
      if (!files || files.length === 0) {
        Toast.show({
          message: "이미지를 다시 보낼 수 없습니다.",
          type: "error",
        });
        return;
      }
      const pendingId = beginRetryImageSend(failed, files);
      if (!pendingId) return;
      onMessageSent?.();
      submitImageWithPendingId(pendingId, files);
    },
    [beginRetryImageSend, onMessageSent, submitImageWithPendingId]
  );

  return {
    onSendMessage,
    onSendImage,
    onRetryTextFailed,
    onRetryImageFailed,
  };
}
