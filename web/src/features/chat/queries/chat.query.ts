import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  loadChatLogs,
  loadChatRoomInfo,
  loadChatRoomList,
  loadChatRoomNotificationState,
} from "../api";
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

  /**
   * `initialPageSize`는 queryKey에 넣지 않는다.
   * 첫 페이지 크기만 바뀌어도 동일 캐시 키로 `setQueryData`·invalidate가 유지되어야 하기 때문이다.
   * 크기 증가 시 refetch는 `useChatRoomMessageSources`에서 처리한다.
   */
  roomInfinite: (
    roomId: string,
    options?: { initialPageSize?: number }
  ) =>
    infiniteQueryOptions({
      queryKey: chatQueryInternal.roomInfinite(roomId),
      queryFn: ({ pageParam }) =>
        loadChatLogs(
          roomId,
          pageParam,
          pageParam === undefined
            ? (options?.initialPageSize ?? CHAT_LOG_PAGE_SIZE)
            : CHAT_LOG_PAGE_SIZE
        ),
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

  roomNotification: (roomId: string) =>
    queryOptions({
      queryKey: chatQueryInternal.roomNotification(roomId),
      queryFn: () => loadChatRoomNotificationState(roomId),
      retry: 0,
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      refetchOnMount: "always",
    }),
};
