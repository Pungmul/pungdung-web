import type { BoardSummary } from "../types";

export function findBoardSummaryByRouteId(
  boardList: BoardSummary[],
  boardID: string
): BoardSummary | undefined {
  return boardList.find((board) => Number(board.id) === Number(boardID));
}
