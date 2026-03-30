"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { BoardChildCategory } from "../../types";

interface BoardChildCategoryTabsProps {
  categories: BoardChildCategory[];
  selectedCategory: BoardChildCategory;
  onCategoryChange: (category: BoardChildCategory) => void;
}

export function BoardChildCategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: BoardChildCategoryTabsProps) {
  return (
    <AnimatePresence>
      <nav
        className="w-full flex flex-row items-center border-b border-grey-200 sticky top-12 md:top-0 bg-background z-10 h-12"
        key="board-child-category-tabs-nav"
      >
        <ul className="flex flex-row w-full px-3 md:px-5 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isSelected = category.id === selectedCategory.id;

            return (
              <motion.li
                key={category.id}
                initial={false}
                animate={{
                  color: isSelected
                    ? "var(--color-grey-800)"
                    : "var(--color-grey-500)",
                }}
                className="relative min-w-[72px] md:min-w-[96px] text-center text-[15px] md:text-[18px] font-semibold py-[12px] cursor-pointer flex-shrink-0"
                onClick={() => onCategoryChange(category)}
              >
                {category.name}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </AnimatePresence>
  );
}
