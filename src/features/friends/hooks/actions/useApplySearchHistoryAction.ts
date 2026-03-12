"use client";

import { type KeyboardEvent,useCallback } from "react";

import { resolveSearchKeywordFromHistoryEntry } from "../../lib";
import { friendStore } from "../../store";
import type { FriendSearchHistoryEntry } from "../../types";

/**
 * 검색 기록: Enter로 키워드型 기록 추가, 목록에서 항목 선택 시 필터 키워드 반영.
 * 삭제는 `useDeleteSearchHistoryAction`.
 */
export function useApplySearchHistoryAction() {
  const { setSearchKeyword, addSearchHistory } = friendStore.getState();

  const handleSearchInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>, currentKeyword: string) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addSearchHistory({ type: "keyword", keyword: currentKeyword });
      }
    },
    [addSearchHistory]
  );

  const handleHistorySelect = useCallback(
    (entry: FriendSearchHistoryEntry) => {
      setSearchKeyword(resolveSearchKeywordFromHistoryEntry(entry));
    },
    [setSearchKeyword]
  );

  return {
    handleSearchInputKeyDown,
    handleHistorySelect,
  };
}
