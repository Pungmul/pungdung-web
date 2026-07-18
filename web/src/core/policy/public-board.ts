const PUBLIC_BOARD_IDS = new Set(["1", "3", "4", "5", "6", "promote"]);

export function isPublicBoardId(boardId: number | string): boolean {
  return PUBLIC_BOARD_IDS.has(String(boardId));
}
