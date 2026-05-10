"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../../queries";
import { resetUnreadCountInRoomList } from "../../../services";
import type { ChatRoomListItem } from "../../../types";

/**
 * 채팅방 리스트에서 특정 방의 안 읽은 메시지 수를 리셋하는 훅
 *
 * @returns resetRoomUnreadCount 함수
 *
 * @example
 * const { resetRoomUnreadCount } = useResetRoomUnreadCount();
 * resetRoomUnreadCount("room-123");
 */
export const useResetRoomUnreadCount = () => {
  const queryClient = useQueryClient();

  const resetRoomUnreadCount = useCallback(
    (roomId: string) => {
      queryClient.setQueryData(
        chatQueries.roomList().queryKey,
        (oldData: ChatRoomListItem[] | undefined) => {
          if (!oldData) return oldData;
          return resetUnreadCountInRoomList(oldData, roomId);
        },
      );
    },
    [queryClient],
  );

  return { resetRoomUnreadCount };
};
