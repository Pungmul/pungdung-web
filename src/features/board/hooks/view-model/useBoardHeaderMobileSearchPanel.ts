"use client";

import { useCallback, useState } from "react";

/** 모바일: 검색 입력 줄 패널 열림/닫힘. */
export function useBoardHeaderMobileSearchPanel() {
  const [isSearching, setSearching] = useState(false);

  const openMobileSearch = useCallback(() => setSearching(true), []);

  const closeMobileSearchPanel = useCallback(() => setSearching(false), []);

  return { isSearching, openMobileSearch, closeMobileSearchPanel };
}
