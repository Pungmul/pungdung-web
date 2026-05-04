"use client";

import { useMemo } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useChatRoomMessagesIndexedDB } from "./useChatRoomMessagesIndexedDB";
import { useEntryInitialChatLogPageSize } from "./useEntryInitialChatLogPageSize";
import { useMergedChatRoomMessagesCache } from "./useMergedChatRoomMessagesCache";
import { useRefetchRoomInfiniteOnEntryPageSizeIncrease } from "./useRefetchRoomInfiniteOnEntryPageSizeIncrease";
import { CHAT_LOG_PAGE_SIZE } from "../../constants";
import { chatQueries } from "../../queries";
import { isRoomInfoReadyForEntrySnapshot } from "../../services/is-room-info-ready-for-entry-snapshot.service";
import { resolveEntryUnreadCountHint } from "../../services/resolve-entry-unread-count-hint.service";

const INITIAL_RENDER_WINDOW_SIZE = CHAT_LOG_PAGE_SIZE * 2;

export type UseChatRoomMessageSourcesParams = {
  roomId: string;
  username: string;
};

/**
 * 채팅방 타임라인 렌더링에 필요한 메시지 소스와 query 상태를 조립한다.
 *
 * IDB hydration 이후 room/detail/infinite query를 활성화하고, 내부 훅을 통해
 * 초기 진입 페이지 크기 정책과 메시지 cache 병합을 연결한다.
 */
export function useChatRoomMessageSources({
  roomId,
  username,
}: UseChatRoomMessageSourcesParams) {
  const {
    hydrated,
    messages: idbMessages,
    oldestCursor: idbOldestCursor,
    listUnreadCountFromIdb,
  } = useChatRoomMessagesIndexedDB(roomId);

  const entryInitialChatLogPageSize = useEntryInitialChatLogPageSize({
    roomId,
    hydrated,
    listUnreadCountFromIdb,
  });

  const roomListQuery = useQuery({
    ...chatQueries.roomList(),
    enabled: hydrated,
  });

  const roomQuery = useQuery({
    ...chatQueries.room(roomId),
    enabled: hydrated,
  });

  const entryUnreadCountHint = useMemo(
    () =>
      resolveEntryUnreadCountHint(
        listUnreadCountFromIdb,
        roomListQuery.data,
        roomId
      ),
    [listUnreadCountFromIdb, roomId, roomListQuery.data]
  );

  const roomInfiniteQuery = useInfiniteQuery({
    ...chatQueries.roomInfinite(roomId, {
      initialPageSize: entryInitialChatLogPageSize,
    }),
    enabled: hydrated,
  });

  useRefetchRoomInfiniteOnEntryPageSizeIncrease({
    roomId,
    hydrated,
    entryInitialChatLogPageSize,
  });

  const mergedAllMessages = useMergedChatRoomMessagesCache({
    roomId,
    username,
    hydrated,
    idbMessages,
    idbOldestCursor,
    roomData: roomQuery.data,
    infiniteData: roomInfiniteQuery.data,
  });

  const cachedMessages = useMemo(
    () => mergedAllMessages.slice(-INITIAL_RENDER_WINDOW_SIZE),
    [mergedAllMessages]
  );

  return {
    cachedMessages,
    entryUnreadCountHint,
    chatRoomData: roomQuery.data,
    infiniteData: roomInfiniteQuery.data,
    isRoomInfoReadyForEntrySnapshot: isRoomInfoReadyForEntrySnapshot({
      isSuccess: roomQuery.isSuccess,
      isFetching: roomQuery.isFetching,
    }),
    isChatRoomLoading: !hydrated || roomQuery.isLoading,
    isInfiniteLoading: !hydrated || roomInfiniteQuery.isLoading,
    fetchNextPage: roomInfiniteQuery.fetchNextPage,
    hasNextPage: roomInfiniteQuery.hasNextPage,
    isFetchingNextPage: roomInfiniteQuery.isFetchingNextPage,
  };
}
