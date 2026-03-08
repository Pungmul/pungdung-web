import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { loadChatLogs,loadChatRoomInfo, loadChatRoomList } from "../api";
import {
  CHAT_LOG_INITIAL_PAGE,
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
      queryFn: ({ pageParam = CHAT_LOG_INITIAL_PAGE }) =>
        loadChatLogs(roomId, pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.size < CHAT_LOG_PAGE_SIZE) {
          return undefined;
        }
        return (lastPage.pageNum ?? CHAT_LOG_INITIAL_PAGE) + 1;
      },
      initialPageParam: CHAT_LOG_INITIAL_PAGE,
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      refetchOnMount: "always",
    }),
};
