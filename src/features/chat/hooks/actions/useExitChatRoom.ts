"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Alert } from "@/shared";

import { chatMutationOptions, chatQueries } from "../../queries";
import { removeChatRoomFromList } from "../../services";
import type { ChatRoomListItem } from "../../types/chat-room.types";

interface UseExitChatRoomOptions {
  roomId: string;
  /** 나가기 성공 후 리다이렉트 경로 (기본값: /chats/r/inbox) */
  redirectPath?: string;
}

/**
 * 채팅방 나가기 기능을 제공하는 훅
 * - 확인 다이얼로그 표시
 * - 채팅방 나가기 API 호출
 * - 관련 쿼리 캐시 정리
 * - 목록 페이지로 리다이렉트
 */
export const useExitChatRoom = ({
  roomId,
  redirectPath = "/chats/r/inbox",
}: UseExitChatRoomOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const exitChatMutation = useMutation(chatMutationOptions.exitChat());

  const exitChatRoom = useCallback(() => {
    Alert.confirm({
      title: "채팅방 나가기",
      message: "채팅방을 나가시겠습니까?",
      confirmColor: "var(--color-red-500)",
      onConfirm: async () => {
        try {
          router.replace(redirectPath);
          await exitChatMutation.mutateAsync(roomId);

          queryClient.removeQueries({
            queryKey: chatQueries.room(roomId).queryKey,
          });

          queryClient.removeQueries({
            queryKey: chatQueries.roomInfinite(roomId).queryKey,
          });

          queryClient.setQueryData(
            chatQueries.roomList().queryKey,
            (old: ChatRoomListItem[] | undefined) =>
              old ? removeChatRoomFromList(old, roomId) : []
          );
        } catch {
          Alert.alert({
            title: "채팅방 나가기 실패",
            message: "채팅방 나가기에 실패했습니다.\n다시 시도해주세요.",
          });
        }
      },
    });
  }, [roomId, redirectPath, router, queryClient, exitChatMutation]);

  return {
    exitChatRoom,
    isExiting: exitChatMutation.isPending,
  };
};
