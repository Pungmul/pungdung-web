"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { BOARD_HEADER_SYNTHETIC_BY_SEGMENT } from "../../constants";
import { boardQueries } from "../../queries";
import type { BoardHeaderDisplay, BoardSummary } from "../../types";

export function useBoardHeaderInfo(
  boardID: string,
  initialBoardInfo?: BoardHeaderDisplay
): BoardSummary | BoardHeaderDisplay | undefined {
  const { data: boardList } = useQuery(boardQueries.list());

  return useMemo(() => {
    const synthetic = BOARD_HEADER_SYNTHETIC_BY_SEGMENT[boardID];
    if (synthetic) {
      return synthetic;
    }

    if (initialBoardInfo) {
      return initialBoardInfo;
    }

    return boardList?.find((board) => Number(board.id) === Number(boardID));
  }, [boardList, boardID, initialBoardInfo]);
}
