"use client";

import { useCallback, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { fetchPostList } from "../../api/client/fetch-post-list.api";
import { boardQueries } from "../../queries";
import {
  type BoardPostData,
  MAX_REFRESH_GAP,
  mergeRefreshedBoardPosts,
  toBoardPostData,
} from "../../services/merge-refreshed-board-posts";

const PAGE_SIZE = 10;

export function useRefreshBoardPosts(boardId: number, rootBoardId: number = boardId) {
  const queryClient = useQueryClient();
  const refreshing = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setIsRefreshing(true);
    setError(null);
    const queryKey = boardQueries.postList(boardId, PAGE_SIZE).queryKey;
    try {
      await queryClient.cancelQueries({ queryKey, exact: true });
      const originalQuery = queryClient.getQueryCache().find({ queryKey, exact: true });
      const previous = queryClient.getQueryData<BoardPostData>(queryKey);
      const first = await fetchPostList(boardId, 1, PAGE_SIZE);
      const freshPages = [first];
      const oldHead = previous?.pages[0]?.list[0];
      while (oldHead && freshPages.at(-1)?.hasNextPage) {
        const fetched = freshPages.flatMap((page) => page.list);
        if (
          fetched.some((post) => post.postId === oldHead.postId) ||
          fetched.length > MAX_REFRESH_GAP
        ) {
          break;
        }
        freshPages.push(
          await fetchPostList(boardId, freshPages.length + 1, PAGE_SIZE)
        );
      }
      const merged = mergeRefreshedBoardPosts(freshPages, previous);
      let posts =
        freshPages.at(-1)?.isLastPage && merged.matched
          ? freshPages.flatMap((page) => page.list)
          : merged.posts;
      posts = posts.slice(0, first.total);
      if (
        merged.matched &&
        posts.length % PAGE_SIZE !== 0 &&
        posts.length < first.total
      ) {
        const finalPageNumber = Math.ceil(posts.length / PAGE_SIZE);
        const finalPage =
          freshPages[finalPageNumber - 1] ??
          (await fetchPostList(boardId, finalPageNumber, PAGE_SIZE));
        posts = [...posts.slice(0, (finalPageNumber - 1) * PAGE_SIZE), ...finalPage.list];
      }
      if (queryClient.getQueryCache().find({ queryKey, exact: true }) !== originalQuery) {
        return;
      }
      await queryClient.cancelQueries({ queryKey, exact: true });
      if (queryClient.getQueryCache().find({ queryKey, exact: true }) !== originalQuery) {
        return;
      }
      queryClient.setQueryData(queryKey, toBoardPostData(first, posts));
      await queryClient.invalidateQueries({
        queryKey: boardQueries.boardInfo(rootBoardId).queryKey,
        exact: true,
      });
    } catch (cause) {
      setError(cause);
    } finally {
      refreshing.current = false;
      setIsRefreshing(false);
    }
  }, [boardId, rootBoardId, queryClient]);

  return { refresh, isRefreshing, error };
}
