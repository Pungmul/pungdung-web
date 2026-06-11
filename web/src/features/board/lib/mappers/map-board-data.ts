import type { PostSummary } from "@/features/post";

import { mapPostListPageDtoToPostListPage } from "./map-post-list-page";
import type { BoardDataDto } from "../../api/client/dto.schema";
import type { BoardOverview } from "../../types/board-overview.types";

export function mapBoardDataDtoToBoardOverview(
  dto: BoardDataDto
): BoardOverview {
  return {
    boardInfo: {
      rootCategoryName: dto.boardInfo.rootCategoryName ?? "",
      childCategoryName: dto.boardInfo.childCategoryName,
      childCategories: dto.boardInfo.childCategories,
    },
    hotPost: dto.hotPost as PostSummary,
    recentPostList: mapPostListPageDtoToPostListPage(dto.recentPostList),
  };
}
