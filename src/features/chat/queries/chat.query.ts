import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { loadChatLogs,loadChatRoomInfo, loadChatRoomList } from "../api";
import {
  CHAT_LOG_PAGE_SIZE,
  DEFAULT_GC_TIME_MS,
  DEFAULT_STALE_TIME_MS,
} from "../constants";

import { chatQueryInternal } from "./chat-query-internal";

const root = chatQueryInternal.all();

/**
 * Chat queryOptions.
 * useQuery(chatQueries.roomList()), invalidateQueries(chatQueries.all()) 등.
 */
export const chatQueries = {
  /** invalidateQueries, removeQueries 시 chat feature 쿼리 전체 */
  all: () => ({ queryKey: root } as const),

  /** 모든 방 상세 정보(`loadChatRoomInfo`, userInfoList 등). room-list·채팅 로그 무한 쿼리는 제외 */
  allRoomInfo: () =>
    ({ queryKey: chatQueryInternal.rooms() } as const),

  roomList: () =>
    queryOptions({
      queryKey: chatQueryInternal.roomLists(),
      queryFn: loadChatRoomList,
      retry: 2,
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }),

  room: (roomId: string) =>
    queryOptions({
      queryKey: chatQueryInternal.room(roomId),
      queryFn: () => loadChatRoomInfo(roomId),
      retry: 0,
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      refetchOnMount: "always",
    }),

  roomInfinite: (roomId: string) =>
    infiniteQueryOptions({
      queryKey: chatQueryInternal.roomInfinite(roomId),
      queryFn: ({ pageParam }) =>
        loadChatLogs(roomId, pageParam, CHAT_LOG_PAGE_SIZE),
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasMore) return undefined;
        if (lastPage.nextCursor == null) return undefined;
        return lastPage.nextCursor;
      },
      initialPageParam: undefined as number | undefined,
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      /** `"always"`는 Strict Mode 마운트·언마운트·재마운트마다 재요청되어 chatlog가 2번 찍히기 쉬움 */
      refetchOnMount: true,
    }),
};
