import type { PostSummary } from "@/features/post";

import type { PostListPageDto } from "../../api/client/dto.schema";
import type { PostListPage } from "../../types/post-list-page.types";

export function mapPostListPageDtoToPostListPage(
  dto: PostListPageDto
): PostListPage {
  return {
    total: dto.total,
    list: dto.list as PostSummary[],
    pageNum: dto.pageNum,
    pageSize: dto.pageSize,
    isFirstPage: dto.isFirstPage,
    isLastPage: dto.isLastPage,
    hasPreviousPage: dto.hasPreviousPage,
    hasNextPage: dto.hasNextPage,
  };
}
