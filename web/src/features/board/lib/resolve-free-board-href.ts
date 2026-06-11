import { getBoardRoute } from "./get-board-route";
import type { BoardSummary } from "../types";

const DEFAULT_NAME_HINT = "자유";
const FALLBACK_FREE_BOARD_ID = 1;
/** 이름 매칭이 없으면 `/board/1` */
export function resolveFreeBoardHref(
  boards: BoardSummary[],
  options?: { nameHint?: string }
): string {
  const hint = options?.nameHint ?? DEFAULT_NAME_HINT;
  const matched = boards.find((b) => b.name.includes(hint));
  return matched !== undefined ? getBoardRoute(matched.id) : getBoardRoute(FALLBACK_FREE_BOARD_ID);
}
