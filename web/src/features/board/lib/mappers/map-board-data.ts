import { mapPostListPageDtoToPostListPage } from "./map-post-list-page";
import type { BoardDataDto } from "../../api/client/dto.schema";
import type { BoardOverview } from "../../types/board-overview.types";
import type { HotPostBannerPost } from "../../types/hot-post-banner.types";

/** 핫 게시글 배너에 필요한 필드가 없으면 미노출 상태로 정규화한다. */
function mapHotPostBanner(rawHotPost: unknown): HotPostBannerPost | null {
  if (rawHotPost === null || typeof rawHotPost !== "object") return null;

  const { postId, title } = rawHotPost as Record<string, unknown>;
  return typeof postId === "number" && typeof title === "string"
    ? { postId, title }
    : null;
}

export function mapBoardDataDtoToBoardOverview(
  dto: BoardDataDto
): BoardOverview {
  return {
    currentCategoryId: dto.currentCategoryId,
    boardInfo: {
      rootCategoryId: dto.boardInfo.rootCategoryId,
      rootCategoryName: dto.boardInfo.rootCategoryName ?? "",
      childCategoryName: dto.boardInfo.childCategoryName,
      isPublic: dto.boardInfo.isPublic,
      childCategories: dto.boardInfo.childCategories,
    },
    hotPost: mapHotPostBanner(dto.hotPost),
    recentPostList: mapPostListPageDtoToPostListPage(dto.recentPostList),
  };
}
