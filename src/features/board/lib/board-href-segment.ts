/** 게시판 목록·URL에서 쓰는 홍보 게시판 문자열 id (`fetchBoardInfoList` 합성 항목과 동일). */
export const PROMOTE_BOARD_SEGMENT = "promote" as const;

export function isPromoteBoard(boardId: number | string): boolean {
  return boardId === PROMOTE_BOARD_SEGMENT;
}

/** `/board/[segment]` 에 쓰는 경로 세그먼트 (홍보는 `promote`). */
export function boardHrefSegment(boardId: number | string): string {
  return isPromoteBoard(boardId) ? PROMOTE_BOARD_SEGMENT : String(boardId);
}
