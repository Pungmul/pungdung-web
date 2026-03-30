/** 게시판 목록·URL에서 쓰는 홍보 게시판 문자열 id (`fetchBoardInfoList` 합성 항목과 동일). */
export const PROMOTE_BOARD_SEGMENT = "promote" as const;
export const CLUB_BOARD_SEGMENT = "club" as const;

export function isPromoteBoard(boardId: number | string): boolean {
  return boardId === PROMOTE_BOARD_SEGMENT;
}

export function isClubBoard(boardId: number | string): boolean {
  return boardId === CLUB_BOARD_SEGMENT;
}

/** `/board/[segment]` 에 쓰는 경로 세그먼트 (합성 게시판은 문자열 segment). */
export function boardHrefSegment(boardId: number | string): string {
  if (isPromoteBoard(boardId)) return PROMOTE_BOARD_SEGMENT;
  if (isClubBoard(boardId)) return CLUB_BOARD_SEGMENT;
  return String(boardId);
}
