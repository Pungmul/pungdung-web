import { describe, expect, it } from "vitest";

import { postDetailResponseDtoSchema } from "../api/client/dto.schema";
import { isDeletedPostDetailDto } from "./is-deleted-post-detail-dto";

describe("isDeletedPostDetailDto", () => {
  it("제목이 삭제된 게시글인 껍데기면 true", () => {
    const raw = {
      postId: 199,
      title: "삭제된 게시글",
      content: "",
      imageList: null,
      commentList: null,
      viewCount: null,
      isLiked: null,
      isWriter: null,
      likedNum: null,
      timeSincePosted: null,
      timeSincePostedText: null,
      author: null,
      authorUsername: "chan00516@naver.com",
      categoryId: null,
    };
    const dto = postDetailResponseDtoSchema.parse(raw);
    expect(isDeletedPostDetailDto(dto)).toBe(true);
  });

  it("일반 상세 응답이면 false", () => {
    const raw = {
      postId: 1,
      title: "제목",
      content: "본문",
      viewCount: 1,
      likedNum: 0,
      timeSincePosted: 0,
      timeSincePostedText: "방금",
      author: "a",
      imageList: [],
      commentList: [],
      isLiked: false,
      isWriter: false,
      categoryId: 7,
    };
    const dto = postDetailResponseDtoSchema.parse(raw);
    expect(isDeletedPostDetailDto(dto)).toBe(false);
  });
});
