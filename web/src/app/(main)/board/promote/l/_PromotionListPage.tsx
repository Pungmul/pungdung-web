"use client";
import { useSearchParams } from "next/navigation";

import { MyPromotionFormList, PromotionList } from "@/features/promotion";

import { Conditional } from "@/shared";

import { PROMOTION_TABS } from "@/features/promotion/constants";

export function PromotionListPage({ isGuest }: { isGuest: boolean }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? PROMOTION_TABS[0]!.value;
  const selectedTab = PROMOTION_TABS.find((t) => t.value === tab) ?? PROMOTION_TABS[0]!;

  return (
    <div className="w-full flex flex-col">
      <Conditional
        value={selectedTab.value}
        cases={{
          "my-promotion-form-list": <MyPromotionFormList />,
          "promotion-list": <PromotionList isGuest={isGuest} />,
        }}
      />
    </div>
  );
}
