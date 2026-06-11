import type { z } from "zod";

import type { PagedMyPosts, PostSummaryWithCategory } from "@/features/post";
import { imageObjectSchema } from "@/features/post";

import {
  myPostListPageDtoSchema,
  postWithCategoryNameDtoSchema,
} from "../../api/client/dto.schema";

import type { ImageObject } from "@/shared";

type MyPostsPageDto = z.infer<typeof myPostListPageDtoSchema>;

function normalizeThumbnail(raw: unknown): ImageObject | null {
  if (raw === null || raw === undefined) {
    return null;
  }
  return imageObjectSchema.parse(raw);
}

/** 목록 한 줄 DTO(+썸네일)를 도메인 `PostSummaryWithCategory` 로 변환한다. */
export function mapMyPostRowToSummaryWithCategory(
  raw: unknown
): PostSummaryWithCategory {
  const row = postWithCategoryNameDtoSchema.parse(raw);
  return {
    postId: row.postId,
    title: row.title,
    content: row.content,
    thumbnail: normalizeThumbnail(row.thumbnail),
    imageNum: row.imageNum,
    viewCount: row.viewCount,
    likedNum: row.likedNum,
    commentNum: row.commentNum,
    timeSincePosted: row.timeSincePosted,
    timeSincePostedText: row.timeSincePostedText,
    createdAt: row.createdAt ?? new Date(Date.now() - row.timeSincePosted * 60_000).toISOString(),
    author: row.author,
    categoryName: row.categoryName,
  };
}

/** `/api/posts/me` 검증 결과를 `PagedMyPosts`로 변환한다. */
export function mapMyPostListPageDtoToPagedMyPosts(
  dto: MyPostsPageDto
): PagedMyPosts {
  const listUnknown = Array.isArray(dto.list) ? dto.list : [];
  const list: PostSummaryWithCategory[] = listUnknown.map(
    mapMyPostRowToSummaryWithCategory
  );

  return {
    total: dto.total,
    list,
    pageNum: dto.pageNum,
    pageSize: dto.pageSize,
    size: typeof dto.size === "number" ? dto.size : 0,
    startRow: typeof dto.startRow === "number" ? dto.startRow : 0,
    endRow: typeof dto.endRow === "number" ? dto.endRow : 0,
    pages: typeof dto.pages === "number" ? dto.pages : 0,
    prePage: typeof dto.prePage === "number" ? dto.prePage : 0,
    nextPage: typeof dto.nextPage === "number" ? dto.nextPage : 0,
    hasNextPage:
      typeof dto.hasNextPage === "boolean" ? dto.hasNextPage : false,
  };
}
