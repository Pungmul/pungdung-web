"use client";

import { useCallback, useEffect, useMemo } from "react";

import debounce from "lodash/debounce";

export interface UseDebouncedFetchNextPageParams {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/** 무한 스크롤 다음 페이지 요청을 디바운스합니다(mutation 액션이 아닌 목록 로딩 UX). */
export function useDebouncedFetchNextPage({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseDebouncedFetchNextPageParams) {
  const debouncedFetchNextPage = useMemo(
    () =>
      debounce(
        async () => {
          if (!isFetchingNextPage && hasNextPage) {
            await fetchNextPage();
          }
        },
        300,
        { leading: true, trailing: false }
      ),
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      debouncedFetchNextPage.cancel();
    };
  }, [debouncedFetchNextPage]);

  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      debouncedFetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, debouncedFetchNextPage]);

  return { loadMore };
}
