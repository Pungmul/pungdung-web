import { z } from "zod";

import { POST_REPORT_TYPES } from "../../constants";

/**
 * @note 순환 의존 방지: `@/features/comment` 루트 barrel 대신 스키마 전용 모듈만 참조.
 * @see docs/guides/07-export-rules.md (cross-feature DTO zod 예외)
 */
import { commentDtoSchema } from "@/features/comment/api/client/dto.schema";

export const imageObjectSchema = z.object({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

export const postDetailResponseDtoSchema = z.object({
  postId: z.number(),
  title: z.string(),
  content: z.string(),
  thumbnail: imageObjectSchema.nullable().optional(),
  imageNum: z.number().optional(),
  viewCount: z.number().nullable(),
  likedNum: z.number().nullable(),
  commentNum: z.number().optional(),
  timeSincePosted: z.number().nullable(),
  timeSincePostedText: z.string().nullable(),
  author: z.string().nullable(),
  /**
   * 식별용 이메일 등. 자유 게시판에서는 항상 null(정상).
   * null을 탈퇴/에러로 해석하지 말 것. 표시에는 author(랜덤 닉네임)만 사용.
   */
  authorUsername: z.string().nullable().optional(),
  imageList: z.array(imageObjectSchema).nullable(),
  commentList: z.array(commentDtoSchema).nullable(),
  isLiked: z.boolean().nullable(),
  isWriter: z.boolean().nullable(),
  categoryId: z.number().nullable(),
});

export type PostDetailResponseDto = z.infer<typeof postDetailResponseDtoSchema>;

/** 게시글 작성 성공 시 envelope.response */
export const createPostResponseDtoSchema = z.looseObject({
  postId: z.number(),
});

export type CreatePostResponseDto = z.infer<typeof createPostResponseDtoSchema>;

/** 게시글 수정 성공 시 envelope.response (업스트림 형태가 가변적일 수 있음) */
export const updatePostResponseDtoSchema = z.object({
  postId: z.number(),
});

/** 게시글 삭제 성공 시 envelope.response */
export const deletePostResponseDtoSchema = z.unknown();

export const postLikeResponseDtoSchema = z.object({
  postId: z.number(),
  liked: z.boolean(),
  likedNum: z.number(),
});

export type PostLikeResponseDto = z.infer<typeof postLikeResponseDtoSchema>;

const postReportReasonSchema = z.enum(
  Object.keys(POST_REPORT_TYPES) as [
    keyof typeof POST_REPORT_TYPES,
    ...(keyof typeof POST_REPORT_TYPES)[],
  ]
);

export const reportPostRequestBodySchema = z.object({
  reportReason: postReportReasonSchema,
});

/** 신고 접수 성공 시 envelope.response */
export const reportPostResponseDtoSchema = z.unknown();
