"use client";
import { useState } from "react";

import { motion } from "framer-motion";

import { Conditional } from "@/shared/components/Conditional";

import { IndividualResponsesTab } from "./IndividualResponsesTab";
import { StatisticsTab } from "./StatisticsTab";
import { PromotionApplicationDetail, PromotionDetail } from "../../../types";

const STATISTICS_TABS = [
  {
    label: "각 신청별 답변",
    value: "individual",
  },
  {
    label: "전체 답변 통계",
    value: "statistics",
  },
] as const;

type TabValue = (typeof STATISTICS_TABS)[number]["value"];

interface StatisticsTabsProps {
  responses: PromotionApplicationDetail[];
  promotionDetail: PromotionDetail;
}

export function StatisticsTabs({
  responses,
  promotionDetail,
}: StatisticsTabsProps) {
  const [selectedTab, setSelectedTab] = useState<TabValue>(
    STATISTICS_TABS[0]!.value
  );

  const handleTabChange = (tab: (typeof STATISTICS_TABS)[number]) => {
    setSelectedTab(tab.value);
  };

  return (
    <section className="relative w-full">
      <nav className="w-full">
        <div
          role="tablist"
          aria-label="신청 답변"
          className="flex flex-row w-full border-b border-grey-200"
        >
          {STATISTICS_TABS.map((item) => {
            const isSelected = item.value === selectedTab;

            return (
              <motion.button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                initial={false}
                animate={{
                  color: isSelected
                    ? "var(--color-grey-800)"
                    : "var(--color-grey-400)",
                }}
                className="relative flex-1 border-0 bg-transparent py-[12px] text-center text-[15px] font-semibold"
                onClick={() => handleTabChange(item)}
              >
                {item.label}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </nav>
      <main className="w-full flex flex-col py-[12px] min-h-[320px]">
        <Conditional
          key={selectedTab}
          value={selectedTab}
          cases={{
            individual: (
              <IndividualResponsesTab
                responses={responses}
                promotionDetail={promotionDetail}
              />
            ),
            statistics: (
              <StatisticsTab
                responses={responses}
                promotionDetail={promotionDetail}
              />
            ),
          }}
        />
      </main>
    </section>
  );
}
