"use client";

import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useBoardTabNavigation } from "../../hooks/view-model/useBoardTabNavigation";
import { boardQueries } from "../../queries";
import { BoardChildCategoryTabs } from "../ui/BoardChildCategoryTabs";

export function BoardLayoutTabs({ boardId }: { boardId: number }) {
  const pathname = usePathname();
  if (pathname !== `/board/${boardId}`) return null;
  return <BoardLayoutTabContent boardId={boardId} />;
}

function BoardLayoutTabContent({ boardId }: { boardId: number }) {
  const { data } = useQuery(boardQueries.boardInfo(boardId));
  const { effectiveChildCategories, selectedCategory, handleCategoryChange } =
    useBoardTabNavigation({ boardId, childCategories: data?.boardInfo.childCategories ?? [] });

  if (!selectedCategory) return null;
  return (
    <BoardChildCategoryTabs
      categories={effectiveChildCategories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
    />
  );
}
