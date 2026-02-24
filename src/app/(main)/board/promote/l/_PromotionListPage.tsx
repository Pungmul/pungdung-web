"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { MyPromotionFormList, PromotionList, PromotionMainTabs } from "@/features/promotion";

import { Conditional, Space } from "@/shared";

import { PROMOTION_TABS, type TabItem } from "@/features/promotion/constants";

export function PromotionListPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? PROMOTION_TABS[0]!.value;
  const selectedTab = PROMOTION_TABS.find((t) => t.value === tab)!;

  const handleTabChange = useCallback(
    (tab: TabItem) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab.value);
      window.history.pushState(
        null,
        "",
        `/board/promote/l?${params.toString()}`
      );
    },
    [searchParams]
  );

  return (
    <div className="w-full flex flex-col">
      <PromotionMainTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />
      <Space className="bg-background h-4 sticky top-12 z-20" />
      <Conditional
        value={selectedTab.value}
        cases={{
          "my-promotion-form-list": <MyPromotionFormList />,
          "promotion-list": <PromotionList />,
        }}
      />
    </div>
  );
}
