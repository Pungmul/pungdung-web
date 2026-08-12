import { isPromoteBoard, PROMOTE_BOARD_SEGMENT } from "./board-href-segment";

export function getBoardRoute(boardId: number | string): string {
  if (isPromoteBoard(boardId)) {
    return `/board/${PROMOTE_BOARD_SEGMENT}/l?tab=promotion-list`;
  }

  return `/board/${boardId}`;
}
