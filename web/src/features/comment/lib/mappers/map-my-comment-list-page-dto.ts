import type { MyCommentListPageDto } from "../../api/client";
import type { MyComment, MyCommentResponse } from "../../types";

function mapMyCommentDto(dto: MyCommentListPageDto["list"][number]): MyComment {
  return {
    id: dto.id,
    postId: dto.postId,
    parentId: dto.parentId,
    content: dto.content,
    deleted: dto.deleted,
    likedNum: dto.likedNum,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    postTitle: dto.postTitle,
  };
}

export function mapMyCommentListPageDtoToResponse(
  dto: MyCommentListPageDto
): MyCommentResponse {
  return {
    total: dto.total,
    list: dto.list.map(mapMyCommentDto),
    pageNum: dto.pageNum,
    pageSize: dto.pageSize,
    size: dto.size,
    startRow: dto.startRow,
    endRow: dto.endRow,
    pages: dto.pages,
    prePage: dto.prePage,
    nextPage: dto.nextPage,
    isFirstPage: dto.isFirstPage,
    isLastPage: dto.isLastPage,
    hasPreviousPage: dto.hasPreviousPage,
    hasNextPage: dto.hasNextPage,
    navigatePages: dto.navigatePages,
    navigatepageNums: dto.navigatepageNums,
    navigateFirstPage: dto.navigateFirstPage,
    navigateLastPage: dto.navigateLastPage,
  };
}
