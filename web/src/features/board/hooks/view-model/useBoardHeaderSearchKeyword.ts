"use client";

import { useCallback, useState } from "react";

/** 검색 라우트에 넘길 키워드 문자열. */
export function useBoardHeaderSearchKeyword(initialKeyword = "") {
  const [searchValue, setSearchValue] = useState(initialKeyword);

  const resetKeyword = useCallback(() => {
    setSearchValue("");
  }, []);

  return { searchValue, setSearchValue, resetKeyword };
}

export type BoardHeaderSearchKeyword = ReturnType<
  typeof useBoardHeaderSearchKeyword
>;
