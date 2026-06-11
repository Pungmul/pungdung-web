import { z } from "zod";

/** 게시글 목록 페이지 (업스트림 페이징 메타 — PageHelper 등 추가 필드 무시) */
export const postListPageDtoSchema = z.looseObject({
  total: z.number(),
  list: z.array(z.unknown()),
  pageNum: z.number(),
  pageSize: z.number(),
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type PostListPageDto = z.infer<typeof postListPageDtoSchema>;

export const childBoardCategoryDtoSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  name: z.string(),
  description: z.string().nullable(),
});

export const boardInfoDtoSchema = z.object({
  /** 목록 전용 호출 등에서 null로 올 수 있음 */
  rootCategoryName: z.string().nullable(),
  childCategoryName: z.string().nullable(),
  childCategories: z.array(childBoardCategoryDtoSchema).default([]),
});

/** 게시판 상세 + 목록 첫 페이지 (`/api/boards/:id`) */
export const boardDataDtoSchema = z.object({
  boardInfo: boardInfoDtoSchema,
  hotPost: z.unknown(),
  recentPostList: postListPageDtoSchema,
});

export type BoardDataDto = z.infer<typeof boardDataDtoSchema>;

export const briefBoardInfoDtoSchema = z.object({
  id: z.union([z.number(), z.string()]),
  parentId: z.number().nullable(),
  name: z.string(),
  description: z.string().nullable(),
});

export const briefBoardInfoListDtoSchema = z.array(briefBoardInfoDtoSchema);

export type BriefBoardInfoDto = z.infer<typeof briefBoardInfoDtoSchema>;

/** `/api/posts/me` 목록 항목 등 카테고리명이 붙은 게시글 한 줄 스키마 */
export const postWithCategoryNameDtoSchema = z.object({
  postId: z.number(),
  title: z.string(),
  content: z.string(),
  thumbnail: z.unknown().nullable(),
  imageNum: z.number(),
  viewCount: z.number(),
  likedNum: z.number(),
  commentNum: z.number(),
  timeSincePosted: z.number(),
  timeSincePostedText: z.string(),
  createdAt: z.string().optional(),
  author: z.string(),
  categoryName: z.string(),
});

export const hotPostListResponseDtoSchema = z.object({
  total: z.number(),
  list: z.array(postWithCategoryNameDtoSchema),
  pageNum: z.number(),
  pageSize: z.number(),
});

/** `/api/posts/me` envelope.response */
export const myPostListPageDtoSchema = z.looseObject({
  total: z.number(),
  list: z.array(z.unknown()),
  pageNum: z.number(),
  pageSize: z.number(),
});

/** `/api/comments/me` envelope.response */
export const myCommentListPageDtoSchema = z.looseObject({
  total: z.number(),
  list: z.array(z.unknown()),
  pageNum: z.number(),
  pageSize: z.number(),
});
