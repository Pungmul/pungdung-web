"use client";

import { useMemo, useState } from "react";

import type { PromotionFormListItem } from "../../types";

export type MyPromotionFormListTab = "DRAFT" | "OPEN";

interface UseMyPromotionFormListViewModelParams {
  promotionFormList?: PromotionFormListItem[];
}

export function useMyPromotionFormListViewModel({
  promotionFormList,
}: UseMyPromotionFormListViewModelParams) {
  const [selectedTab, setSelectedTab] =
    useState<MyPromotionFormListTab>("DRAFT");

  const { draft, published } = useMemo(() => {
    const list = promotionFormList ?? [];
    return {
      draft: list.filter((form) => form.status === "DRAFT"),
      published: list.filter((form) => form.status === "OPEN"),
    };
  }, [promotionFormList]);

  const selectedPromotionFormList = selectedTab === "DRAFT" ? draft : published;

  return {
    selectedTab,
    setSelectedTab,
    draft,
    published,
    selectedPromotionFormList,
  };
}
