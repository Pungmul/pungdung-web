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
      <ul className="flex flex-row w-full">
        {tabs.map((item, index) => (
          <motion.li
            key={index}
            initial={false}
            animate={{
              color:
                item.value === selectedTab.value
                  ? "var(--color-grey-800)"
                  : "var(--color-grey-400)",
            }}
            className="relative flex-1 border-b border-grey-200 text-center text-[15px] font-semibold py-[12px] cursor-pointer"
            onClick={() => onTabChange(item)}
          >
            {item.label}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
              initial={{ opacity: 0 }}
              animate={{
                opacity: item.value === selectedTab.value ? 1 : 0,
              }}
              transition={{
                duration: 0.25,
              }}
            />
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};
