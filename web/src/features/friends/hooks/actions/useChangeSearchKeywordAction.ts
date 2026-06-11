"use client";

import { type ChangeEvent,useCallback } from "react";

import { friendStore } from "../../store";

/** 검색창: 필터 키워드 입력만 */
export function useChangeSearchKeywordAction() {
  const { setSearchKeyword } = friendStore.getState();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(event.target.value);
    },
    [setSearchKeyword]
  );

  return { handleChange };
}
