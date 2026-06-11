"use client";

import { useEffect } from "react";

import { friendStore } from "../../store";

/** 친구 검색 패널 언마운트 시 검색 입력 키워드만 초기화(기록 persist는 유지) */
export function useClearFriendSearchKeywordOnUnmount() {
  const setSearchKeyword = friendStore.getState().setSearchKeyword;

  useEffect(() => {
    return () => {
      setSearchKeyword("");
    };
  }, [setSearchKeyword]);
}
