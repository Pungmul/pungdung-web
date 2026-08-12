import { isPromoteBoard, PROMOTE_BOARD_SEGMENT } from "./board-href-segment";

export function getBoardRoute(
  boardId: number | string,
  tabId?: number
): string {
  if (isPromoteBoard(boardId)) {
    return `/board/${PROMOTE_BOARD_SEGMENT}/l?tab=promotion-list`;
  }

  if (tabId !== undefined) {
    return `/board/${boardId}?tab=${tabId}`;
  }

  return `/board/${boardId}`;
}
