"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../../queries";

/** 채팅방 리스트 탭 직전 room info를 prefetch한다. */
export function usePrefetchChatRoomOnNavigate() {
  const queryClient = useQueryClient();

  return useCallback(
    (roomId: string) => {
      if (!roomId) return;

      void queryClient.prefetchQuery(chatQueries.room(roomId));
    },
    [queryClient]
  );
}
