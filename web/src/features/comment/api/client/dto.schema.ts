/**
 * @note `@/features/comment` 루트 barrel을 거치면 `post` 등과 순환 의존이 생길 수 있어,
 * 조합용 스키마(`commentDtoSchema` 등)는 `@/features/comment/api/client/dto.schema`에서만 import한다.
 */
import { z } from "zod";

import { COMMENT_REPORT_TYPES } from "../../constants";

export const commentImageObjectDtoSchema = z.object({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

export const commentDtoSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    commentId: z.number(),
    postId: z.number(),
    parentId: z.number().nullable(),
    content: z.string(),
    /** 삭제·탈퇴 등 서버에서 null로 내려올 수 있음 */
    userName: z.string().nullable(),
    profile: commentImageObjectDtoSchema.nullable().optional(),
    createdAt: z.string(),
    replies: z.array(commentDtoSchema).nullable().optional(),
  })
);

export const createCommentRequestDtoSchema = z.object({
  content: z.string(),
  anonymity: z.boolean(),
});

export const createReplyRequestDtoSchema = createCommentRequestDtoSchema.extend({
  parentId: z.number(),
});

export const reportCommentRequestDtoSchema = z.object({
  reportReason: z.enum(
    Object.keys(COMMENT_REPORT_TYPES) as [
      keyof typeof COMMENT_REPORT_TYPES,
      ...(keyof typeof COMMENT_REPORT_TYPES)[],
    ]
  ),  
});

export const myCommentDtoSchema = z.object({
  id: z.number(),
  postId: z.number(),
  parentId: z.number().nullable(),
  content: z.string(),
  deleted: z.boolean(),
  likedNum: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  postTitle: z.string(),
});

export const myCommentListPageDtoSchema = z.object({
  total: z.number(),
  list: z.array(myCommentDtoSchema),
  pageNum: z.number(),
  pageSize: z.number(),
  size: z.number(),
  startRow: z.number(),
  endRow: z.number(),
  pages: z.number(),
  prePage: z.number(),
  nextPage: z.number(),
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
  navigatePages: z.number(),
  navigatepageNums: z.array(z.number()),
  navigateFirstPage: z.number(),
  navigateLastPage: z.number(),
});

export const commentMutationResponseDtoSchema = z.unknown();

export type CommentDto = z.infer<typeof commentDtoSchema>;
export type CommentImageObjectDto = z.infer<typeof commentImageObjectDtoSchema>;
export type MyCommentDto = z.infer<typeof myCommentDtoSchema>;
export type MyCommentListPageDto = z.infer<typeof myCommentListPageDtoSchema>;
export type CreateCommentRequestDto = z.infer<
  typeof createCommentRequestDtoSchema
>;
export type CreateReplyRequestDto = z.infer<typeof createReplyRequestDtoSchema>;
export type ReportCommentRequestDto = z.infer<
  typeof reportCommentRequestDtoSchema
>;
export type CommentMutationResponseDto = z.infer<
  typeof commentMutationResponseDtoSchema
>;
