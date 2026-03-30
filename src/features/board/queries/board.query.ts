import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";

import {
  BOARD_INFO_LIST_GC_TIME_MS,
  BOARD_INFO_LIST_STALE_TIME_MS,
} from "../constants";

import {
  fetchBoardDetails,
  fetchBoardInfo,
  fetchBoardInfoList,
  fetchClubBoardDetails,
  fetchClubPostList,
  fetchHotPostList,
  fetchMyCommentList,
  fetchMyPostList,
  fetchPostList,
  fetchSearchPostList,
} from "../api/client";

/** 게시판 상세·글 목록·검색·핫 등 자주 바뀌는 데이터 */
const BOARD_STALE_TIME = 1000 * 5; // ~5s
const BOARD_GC_TIME = 1000 * 15; // 15 seconds (길게 캐시하지 않음)
/** 단일 게시판 메타(`boardInfo`) */
const BOARD_INFO_STALE_TIME = 1000 * 60 * 10; // 10 minutes
const BOARD_INFO_GC_TIME = 1000 * 60 * 15; // 15 minutes
const DEFAULT_POST_LIST_SIZE = 10; // 10 posts

const boardKey = ["board"] as const;

export const boardQueries = {
  all: () => boardKey,
  lists: () => [...boardQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: [...boardQueries.lists(), "board-info"] as const,
      queryFn: fetchBoardInfoList,
      staleTime: BOARD_INFO_LIST_STALE_TIME_MS,
      gcTime: BOARD_INFO_LIST_GC_TIME_MS,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
  details: () => [...boardQueries.all(), "detail"] as const,
  detail: (boardId: number) =>
    queryOptions({
      queryKey: [...boardQueries.details(), boardId] as const,
      queryFn: () => fetchBoardDetails(boardId),
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
  boardInfo: (boardId: number) =>
    queryOptions({
      queryKey: [...boardQueries.details(), boardId, "info"] as const,
      queryFn: () => fetchBoardInfo(boardId),
      staleTime: BOARD_INFO_STALE_TIME,
      gcTime: BOARD_INFO_GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
  clubDetail: (size = DEFAULT_POST_LIST_SIZE) =>
    queryOptions({
      queryKey: [...boardQueries.details(), "club", size] as const,
      queryFn: () => fetchClubBoardDetails(1, size),
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
  postLists: () => [...boardQueries.all(), "post-list"] as const,
  postList: (boardId: number, size = DEFAULT_POST_LIST_SIZE) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.postLists(), boardId, size] as const,
      queryFn: ({ pageParam = 1 }) => fetchPostList(boardId, pageParam, size),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 1,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      placeholderData: keepPreviousData,
    }),
  clubPostList: (size = DEFAULT_POST_LIST_SIZE) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.postLists(), "club", size] as const,
      queryFn: ({ pageParam = 1 }) =>
        fetchClubPostList(pageParam as number, size),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 1,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      placeholderData: keepPreviousData,
    }),
  searchPostLists: () => [...boardQueries.all(), "search-post-list"] as const,
  searchPostList: (
    boardId: number,
    keyword: string,
    size = DEFAULT_POST_LIST_SIZE
  ) =>
    infiniteQueryOptions({
      queryKey: [
        ...boardQueries.searchPostLists(),
        boardId,
        keyword,
        size,
      ] as const,
      queryFn: ({ pageParam = 1 }) =>
        fetchSearchPostList(boardId, keyword, pageParam, size),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 1,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      placeholderData: keepPreviousData,
    }),
  hotPosts: () => [...boardQueries.all(), "hot-post"] as const,
  hotPostList: (size = DEFAULT_POST_LIST_SIZE) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.hotPosts(), size] as const,
      queryFn: ({ pageParam = 1 }) =>
        fetchHotPostList(pageParam as number, size).then((data) =>
          // 서버 플래그 비정상 동작으로 인해 size 충족시 hasNextPage: true 로 설정
          data.list.length === size ? { ...data, hasNextPage: true } : data
        ),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 1,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
      placeholderData: keepPreviousData,
    }),
  myPosts: () => [...boardQueries.all(), "my-post"] as const,
  myPostList: (size = DEFAULT_POST_LIST_SIZE) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.myPosts(), size] as const,
      queryFn: ({ pageParam = 1 }) =>
        fetchMyPostList(pageParam as number, size).then((data) =>
          // 서버 플래그 비정상 동작으로 인해 size 충족시 hasNextPage: true 로 설정
          data.list.length === size ? { ...data, hasNextPage: true } : data
        ),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 1,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
    }),
  myComments: () => [...boardQueries.all(), "my-comment"] as const,
  myCommentList: (size = DEFAULT_POST_LIST_SIZE) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.myComments(), size] as const,
      queryFn: ({ pageParam = 0 }) =>
        fetchMyCommentList(pageParam, size).then((data) =>
          // 서버 플래그 비정상 동작으로 인해 size 충족시 hasNextPage: true 로 설정
          data.list.length === size ? { ...data, hasNextPage: true } : data
        ),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined,
      initialPageParam: 0,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: BOARD_STALE_TIME,
      gcTime: BOARD_GC_TIME,
    }),
};
