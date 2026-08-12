"use client";

import { useEffect } from "react";

import { useFrequentBoard } from "../../store";
import type { BoardChildCategory, BoardOverview } from "../../types";

interface UseTrackBoardVisitParams {
  boardId: number;
  boardData: BoardOverview | undefined;
  selectedCategory: BoardChildCategory | undefined;
}

export function useTrackBoardVisit({
  boardId,
  boardData,
  selectedCategory,
}: UseTrackBoardVisitParams) {
  const { visitBoard } = useFrequentBoard();

  useEffect(() => {
    if (!boardData) {
      return;
    }

    if (selectedCategory) {
      visitBoard({
        id: boardId,
        tabId: selectedCategory.id,
        name: selectedCategory.name,
      });
      return;
    }

    const hasChildCategories = boardData.boardInfo.childCategories.length > 0;
    if (hasChildCategories) {
      return;
    }

    visitBoard({ id: boardId, name: boardData.boardInfo.rootCategoryName });
  }, [boardId, boardData, selectedCategory, visitBoard]);
}
