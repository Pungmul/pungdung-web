"use client";

import { useCallback, useRef, useState } from "react";

const PROMOTION_POSTING_EDITOR_TABS = [
  { label: "공연 소개", value: "description" },
  { label: "설문", value: "question" },
] as const;

export type PromotionPostingEditorTab =
  (typeof PROMOTION_POSTING_EDITOR_TABS)[number];

/** 등록 폼: 소개/설문 탭 선택 + 탭 영역 상단으로 스크롤 정렬 */
export function usePromotionPostingEditorTabs() {
  const [selectedTab, setSelectedTab] = useState<PromotionPostingEditorTab>(
    PROMOTION_POSTING_EDITOR_TABS[0]!
  );
  const tabsSectionRef = useRef<HTMLElement>(null);

  const handleTabChange = useCallback((tab: PromotionPostingEditorTab) => {
    setSelectedTab(tab);
    if (!tabsSectionRef.current) return;
    const offset = 80;
    const top = tabsSectionRef.current.offsetTop - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return {
    tabDefinitions: PROMOTION_POSTING_EDITOR_TABS,
    selectedTab,
    handleTabChange,
    tabsSectionRef,
  };
}
