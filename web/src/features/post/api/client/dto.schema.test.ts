import { describe, expect, it } from "vitest";

import {
  imageObjectSchema,
  postDetailResponseDtoSchema,
  postLikeResponseDtoSchema,
  reportPostRequestBodySchema,
} from "./dto.schema";

const sampleComment = {
  commentId: 1,
  postId: 42,
  parentId: null,
  content: "c",
  userName: "u",
  createdAt: "",
  replies: [],
};

describe("post api client dto.schema", () => {
  describe("imageObjectSchema", () => {
    it("모든 필드가 채워지면 통과한다", () => {
      const raw = {
        id: 1,
        originalFilename: "",
        convertedFileName: "",
        fullFilePath: "",
        fileType: "image/jpeg",
        fileSize: 0,
        createdAt: "",
      };
      expect(imageObjectSchema.safeParse(raw).success).toBe(true);
    });

    it("필수 필드 누락이면 실패한다", () => {
      expect(imageObjectSchema.safeParse({ id: 1 }).success).toBe(false);
    });
  });

  describe("postDetailResponseDtoSchema", () => {
    it("minimal valid dto를 파싱한다", () => {
      const raw = {
        postId: 1,
        title: "제목",
        content: "본문",
        viewCount: 0,
        likedNum: 0,
        timeSincePosted: 0,
        timeSincePostedText: "",
        author: "",
        imageList: [],
        commentList: [sampleComment],
        isLiked: false,
        isWriter: false,
        categoryId: 9,
      };
      expect(postDetailResponseDtoSchema.safeParse(raw).success).toBe(true);
    });

    it("postId 누락이면 실패한다", () => {
      const raw = {
        title: "제목",
        content: "본문",
        viewCount: 0,
        likedNum: 0,
        timeSincePosted: 0,
        timeSincePostedText: "",
        author: "",
        imageList: [],
        commentList: null,
        isLiked: false,
        isWriter: false,
        categoryId: null,
      };
      expect(postDetailResponseDtoSchema.safeParse(raw).success).toBe(false);
    });
  });

  describe("postLikeResponseDtoSchema", () => {
    it("좋아요 스냅샷 형태면 통과한다", () => {
      const parsed = postLikeResponseDtoSchema.safeParse({
        postId: 1,
        liked: true,
        likedNum: 99,
      });
      expect(parsed.success).toBe(true);
    });

    it("필수 필드 누락이면 실패한다", () => {
      expect(postLikeResponseDtoSchema.safeParse({ postId: 1 }).success).toBe(false);
    });
  });

  describe("reportPostRequestBodySchema", () => {
    it("신고 이유만 있으면 통과한다", () => {
      expect(
        reportPostRequestBodySchema.safeParse({
          reportReason: "OTHER",
        }).success
      ).toBe(true);
    });

    it("허용되지 않은 reason이면 실패한다", () => {
      expect(
        reportPostRequestBodySchema.safeParse({
          reportReason: "__INVALID__",
        }).success
      ).toBe(false);
    });

    it("본문 필드 자체가 없으면 실패한다", () => {
      expect(reportPostRequestBodySchema.safeParse({}).success).toBe(false);
    });
  });
});
