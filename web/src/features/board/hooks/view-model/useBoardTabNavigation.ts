"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  deriveBoardTabState,
  getEffectiveBoardTabCategories,
} from "../../services/derive-board-tab-state";
import type { BoardChildCategory } from "../../types";

export interface UseBoardTabNavigationParams {
  /** 상세 화면 루트 게시판 ID (`/board/[boardID]` 경로 값) */
  boardId: number;
  /** 상세 API의 `boardInfo.childCategories` */
  childCategories: BoardChildCategory[];
}

/**
 * 게시판 상세의 자식 카테고리 탭 선택 상태를 URL `?tab=`과 동기화한다.
 *
 * - 탭 변경: `history.pushState` (기존 화면 뒤로가기 동작 유지)
 * - 잘못된/누락된 tab 쿼리: `history.replaceState`로 공유 가능한 URL로 정규화
 */
export function useBoardTabNavigation({
  boardId,
  childCategories,
}: UseBoardTabNavigationParams) {
  const hasChildCategories = childCategories.length > 0;
  const effectiveChildCategories = getEffectiveBoardTabCategories(
    boardId,
    childCategories
  );

  const searchParams = useSearchParams();
  const selectedTabId = searchParams.get("tab");

  const {
    selectedCategory,
    selectedCategoryId,
    postListBoardId,
    shouldNormalizeTabQueryParam,
  } = deriveBoardTabState({
    boardId,
    categories: effectiveChildCategories,
    selectedTabId,
    hasChildCategories,
  });

  const buildTabUrl = useCallback(
    (tabId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", String(tabId));
      return `/board/${boardId}?${params.toString()}`;
    },
    [boardId, searchParams]
  );

  useEffect(() => {
    if (!shouldNormalizeTabQueryParam || selectedCategoryId === undefined) {
      return;
    }
    window.history.replaceState(null, "", buildTabUrl(selectedCategoryId));
  }, [buildTabUrl, selectedCategoryId, shouldNormalizeTabQueryParam]);

  const handleCategoryChange = useCallback(
    (category: BoardChildCategory) => {
      window.history.pushState(null, "", buildTabUrl(category.id));
    },
    [buildTabUrl]
  );

  return {
    hasChildCategories,
    effectiveChildCategories,
    selectedCategory,
    postListBoardId,
    handleCategoryChange,
  };
}
