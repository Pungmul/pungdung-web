import { findBoardSummaryByRouteId } from "./find-board-summary-by-route-id";
import { prefetchBoardInfoList } from "../api/server/prefetch-board-info-list.api";

const FALLBACK_BOARD_METADATA_TITLE = "풍덩 | 게시판";

export async function getBoardRscMetadataTitle(
  boardID: string
): Promise<string> {
  try {
    const boardList = await prefetchBoardInfoList();
    const boardName =
      findBoardSummaryByRouteId(boardList, boardID)?.name ||
      "알 수 없는 게시판";
    return `풍덩 | ${boardName}`;
  } catch {
    return FALLBACK_BOARD_METADATA_TITLE;
  }
}
