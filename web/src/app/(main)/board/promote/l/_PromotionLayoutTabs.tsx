"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PromotionMainTabs } from "@/features/promotion";

import { useFrequentBoard } from "@/features/board/store";
import { PROMOTION_TABS, type TabItem } from "@/features/promotion/constants";

export function PromotionLayoutTabs({ isGuest }: { isGuest: boolean }) {
  const searchParams = useSearchParams();
  const visitBoard = useFrequentBoard((state) => state.visitBoard);
  const selectedTab = PROMOTION_TABS.find((tab) => tab.value === searchParams.get("tab")) ?? PROMOTION_TABS[0]!;

  useEffect(() => {
    visitBoard({ id: "promote", name: "홍보 게시판" });
  }, [visitBoard]);

  const handleTabChange = useCallback((tab: TabItem) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab.value);
    window.history.pushState(null, "", `/board/promote/l?${params.toString()}`);
  }, [searchParams]);

  return <PromotionMainTabs selectedTab={selectedTab} onTabChange={handleTabChange} isGuest={isGuest} />;
}
