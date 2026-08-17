"use client";
import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

import { PROMOTION_TABS, type TabItem } from "../../../constants";

interface PromotionMainTabsProps {
  selectedTab: TabItem;
  onTabChange: (tab: TabItem) => void;
  isGuest: boolean;
}

export function PromotionMainTabs({
  selectedTab,
  onTabChange,
  isGuest,
}: PromotionMainTabsProps) {
  const visibleTabs = isGuest
    ? PROMOTION_TABS.filter((item) => item.value === "promotion-list")
    : PROMOTION_TABS;

  return (
    <AnimatePresence>
      <nav
        className="w-full flex flex-row items-center justify-between border-b border-grey-200 sticky top-0 bg-background z-20 h-12"
        key="promotion-tabs-nav"
      >
        <div
          role="tablist"
          aria-label="공연"
          className="flex flex-row w-full px-3 md:px-5 flex-grow"
        >
          {visibleTabs.map((item) => {
            const isSelected = item.value === selectedTab.value;

            return (
              <motion.button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={isSelected}
                initial={false}
                animate={{
                  color: isSelected
                    ? "var(--color-grey-800)"
                    : "var(--color-grey-500)",
                }}
                className="relative w-[72px] border-0 bg-transparent py-[12px] text-center text-[15px] font-semibold md:w-[96px] md:text-[18px]"
                onClick={() => onTabChange(item)}
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
        <Link
          href="/board/promote/upcoming"
          className="inline-flex items-center gap-1 text-grey-500 text-[14px] md:text-[16px] flex-shrink-0 px-1"
        >
          관람 신청한 공연 목록{" "}
          <span className="inline-flex size-5 items-center justify-center">
            <ChevronRightIcon className="size-full text-grey-500" />
          </span>
        </Link>
      </nav>
    </AnimatePresence>
  );
}
