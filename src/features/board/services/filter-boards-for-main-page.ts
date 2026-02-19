import type { BoardSummary } from "../types";

/** 메인 게시판 목록 영역에 노출할 게시판만 남깁니다 (숫자 id 또는 홍보 게시판). */
export function filterBoardsForMainPage(
  boardList: BoardSummary[]
): BoardSummary[] {
  return boardList.filter(
    (board) => typeof board.id === "number" || board.id === "promote"
  );
}
