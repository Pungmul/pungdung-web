"use client";

import { useCallback } from "react";

import { useMutation } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { chatMutationOptions } from "../../../queries";
import { fileListFromBlobObjectUrls } from "../../../services";
import type { ReadSignFn } from "../../../socket/read-sign.types";
import type {
  ChatRoomOutgoingMessageHandlers,
  PendingMessage,
} from "../../../types";

const SOCKET_NOT_READY_TOAST_MESSAGE =
  "채팅 연결 중입니다. 잠시 후 다시 시도해 주세요.";

export type UseSendMessageActionParams = {
  roomId: string;
  readSign: ReadSignFn;
  outgoingMessageHandlers: ChatRoomOutgoingMessageHandlers;
  /** STOMP 연결 + 방 메시지 구독이 준비된 뒤에만 HTTP 전송 */
  canSend: boolean;
  onMessageSent?: () => void;
};

export function useSendMessageAction({
  roomId,
  readSign,
  outgoingMessageHandlers,
  canSend,
  onMessageSent,
}: UseSendMessageActionParams) {
  const { mutateAsync: sendTextMessage } = useMutation(
    chatMutationOptions.sendTextMessage()
  );
  const { mutateAsync: sendImageMessage } = useMutation(
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

  const ensureCanSend = useCallback(() => {
    if (canSend) {
      return true;
    }

    Toast.show({
      message: SOCKET_NOT_READY_TOAST_MESSAGE,
      type: "info",
    });
    return false;
  }, [canSend]);

  const submitTextWithPendingId = useCallback(
    async (pendingId: string, content: string) => {
      try {
        await sendTextMessage({
          roomId,
          message: { content, clientId: pendingId },
        });
        // pending 제거는 소켓 echo에서만 한다(로컬 state와 한 커밋).
        readSign();
      } catch {
        Toast.show({
          message: "채팅 전송에 실패했습니다.",
          type: "error",
        });
        commitTextSendFailure(pendingId);
      }
    },
    [roomId, sendTextMessage, commitTextSendFailure, readSign]
  );

  const onSendMessage = useCallback(
    async (message: string) => {
      if (!ensureCanSend()) {
        return;
      }

      const pendingId = beginTextSend(message);
      onMessageSent?.();
      await submitTextWithPendingId(pendingId, message);
    },
    [beginTextSend, ensureCanSend, onMessageSent, submitTextWithPendingId]
  );

  const onRetryTextFailed = useCallback(
    async (failed: PendingMessage) => {
      if (!ensureCanSend()) {
        return;
      }

      const pendingId = beginRetryTextSend(failed);
      if (!pendingId) return;
      onMessageSent?.();
      await submitTextWithPendingId(pendingId, failed.content ?? "");
    },
    [beginRetryTextSend, ensureCanSend, onMessageSent, submitTextWithPendingId]
  );

  const submitImageWithPendingId = useCallback(
    async (pendingId: string, files: FileList) => {
      try {
        const formData = new FormData();
        if (!files || files.length === 0) throw new Error("파일이 없습니다.");
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
        formData.append("clientId", pendingId);

        await sendImageMessage({ roomId, formData });
        // pending 제거는 확정 메시지가 query/socket에 반영된 뒤 view-model에서 처리한다.
        readSign();
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
    [roomId, sendImageMessage, commitImageSendFailure, readSign]
  );

  const onSendImage = useCallback(
    async (files: FileList) => {
      if (!ensureCanSend()) {
        return;
      }

      const pendingId = beginImageSend(files);
      onMessageSent?.();
      await submitImageWithPendingId(pendingId, files);
    },
    [beginImageSend, ensureCanSend, onMessageSent, submitImageWithPendingId]
  );

  const onRetryImageFailed = useCallback(
    async (failed: PendingMessage) => {
      if (!ensureCanSend()) {
        return;
      }

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
      await submitImageWithPendingId(pendingId, files);
    },
    [
      beginRetryImageSend,
      ensureCanSend,
      onMessageSent,
      submitImageWithPendingId,
    ]
  );

  return {
    onSendMessage,
    onSendImage,
    onRetryTextFailed,
    onRetryImageFailed,
  };
}
