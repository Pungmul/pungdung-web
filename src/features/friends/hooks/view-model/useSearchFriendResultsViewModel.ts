"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/shared/lib";

import { friendQueries } from "../../queries";
import { friendStore } from "../../store";

/** 친구 검색 결과: 필터 키워드·디바운스·검색 쿼리(검색 기록 목록과 무관) */
export function useSearchFriendResultsViewModel() {
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const {
    data: foundList,
    isFetching,
    isError,
  } = useQuery(friendQueries.findFriends(debouncedKeyword));

  const { hasResults, isLoading } = useMemo(() => {
    const resultLength = foundList?.length ?? 0;
    return {
      hasResults: resultLength > 0,
      isLoading:
        searchKeyword.trim().length > 0 && isFetching && resultLength === 0,
    };
  }, [foundList, searchKeyword, isFetching]);

  return {
    searchKeyword,
    foundList,
    isFetching,
    isError,
    hasResults,
    isLoading,
  };
}
