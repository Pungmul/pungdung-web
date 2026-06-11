"use client";

import { useEffect } from "react";

import { useFrequentBoard } from "../../store";
import type { BoardOverview } from "../../types";

interface UseTrackBoardVisitParams {
  boardId: number;
  boardData: BoardOverview | undefined;
}

export function useTrackBoardVisit({
  boardId,
  boardData,
}: UseTrackBoardVisitParams) {
  const { visitBoard } = useFrequentBoard();

  useEffect(() => {
    if (!boardData) {
      return;
    }

    visitBoard({ id: boardId, name: boardData.boardInfo.rootCategoryName });
  }, [boardId, boardData, visitBoard]);
}
