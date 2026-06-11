"use client";

import { useCallback } from "react";

import { friendStore } from "../../store";
import type { FriendSearchHistoryEntry } from "../../types";

/** 검색 기록 항목 삭제만 */
export function useDeleteSearchHistoryAction() {
  const { deleteSearchHistory } = friendStore.getState();

  const handleHistoryDelete = useCallback(
    (entryId: FriendSearchHistoryEntry["id"]) => {
      deleteSearchHistory(entryId);
    },
    [deleteSearchHistory]
  );

  return { handleHistoryDelete };
}
