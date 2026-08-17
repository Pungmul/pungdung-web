"use client";

import { motion } from "framer-motion";

interface PromotionTabNavProps<T extends { label: string; value: string }> {
  tabs: T[];
  selectedTab: T;
  onTabChange: (tab: T) => void;
}

export const PromotionTabNav = <T extends { label: string; value: string }>({
  tabs,
  selectedTab,
  onTabChange,
}: PromotionTabNavProps<T>) => {
  return (
    <nav className="w-full" key="promotion-tabs-nav">
      <div role="tablist" aria-label="공연 작성" className="flex flex-row w-full">
        {tabs.map((item) => {
          const isSelected = item.value === selectedTab.value;

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
              className="relative flex-1 border-0 border-b border-grey-200 bg-transparent py-[12px] text-center text-[15px] font-semibold"
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
    </nav>
  );
};
