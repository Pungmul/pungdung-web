"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CHAT_LOG_PAGE_SIZE } from "../../../constants";
import { chatQueries } from "../../../queries";

type UseRefetchRoomInfiniteOnEntryPageSizeIncreaseParams = {
  roomId: string;
  hydrated: boolean;
  entryInitialChatLogPageSize: number;
};

/**
 * 진입 기준 page size가 커진 경우 현재 infinite query를 다시 가져온다.
 *
 * queryKey에는 page size를 포함하지 않으므로, 같은 cache key를 유지하면서
 * 첫 페이지 요청 크기만 반영하기 위해 staleTime 0으로 fresh fetch한다.
 */
export function useRefetchRoomInfiniteOnEntryPageSizeIncrease({
  roomId,
  hydrated,
  entryInitialChatLogPageSize,
}: UseRefetchRoomInfiniteOnEntryPageSizeIncreaseParams) {
  const queryClient = useQueryClient();
  const previousInitialPageSizeRef = useRef({
    roomId,
    pageSize: CHAT_LOG_PAGE_SIZE,
  });

  if (previousInitialPageSizeRef.current.roomId !== roomId) {
    previousInitialPageSizeRef.current = {
      roomId,
      pageSize: CHAT_LOG_PAGE_SIZE,
    };
  }

  useEffect(() => {
    if (!hydrated) return;
    if (
      entryInitialChatLogPageSize <= previousInitialPageSizeRef.current.pageSize
    ) {
      return;
    }

    previousInitialPageSizeRef.current.pageSize = entryInitialChatLogPageSize;
    void queryClient.fetchInfiniteQuery({
      ...chatQueries.roomInfinite(roomId, {
        initialPageSize: entryInitialChatLogPageSize,
      }),
      staleTime: 0,
    });
  }, [entryInitialChatLogPageSize, hydrated, queryClient, roomId]);
}
