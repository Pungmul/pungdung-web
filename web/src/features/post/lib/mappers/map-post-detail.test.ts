import { describe, expect, it } from "vitest";

import { postDetailResponseDtoSchema } from "../../api/client/dto.schema";

import { mapPostDetailDtoToArticle } from "./map-post-detail";

describe("mapPostDetailDtoToArticle", () => {
  it("검증된 상세 DTO를 도메인 모델로 펼치고 댓글 수를 유지한다", () => {
    const raw = {
      postId: 1,
      title: "제목",
      content: "본문",
      thumbnail: null,
      imageNum: 0,
      viewCount: 2,
      likedNum: 3,
      commentNum: 1,
      timeSincePosted: 0,
      timeSincePostedText: "방금",
      author: "작성자",
      imageList: [],
      isLiked: false,
      isWriter: true,
      categoryId: 7,
    };

    const dto = postDetailResponseDtoSchema.parse(raw);
    const article = mapPostDetailDtoToArticle(dto);

    expect(article.postId).toBe(1);
    expect(article.thumbnail).toBeNull();
    expect(article.author).toBe("작성자");
    expect(article.commentNum).toBe(1);
  });

  it("authorUsername이 null이어도 author 닉네임만 도메인 author로 쓴다", () => {
    const dto = postDetailResponseDtoSchema.parse({
      postId: 2,
      title: "제목",
      content: "본문",
      thumbnail: null,
      imageNum: 0,
      viewCount: 0,
      likedNum: 0,
      commentNum: 0,
      timeSincePosted: 0,
      timeSincePostedText: "방금",
      author: "우울한 대포수",
      authorUsername: null,
      imageList: [],
      isLiked: false,
      isWriter: false,
      categoryId: 7,
    });

    const article = mapPostDetailDtoToArticle(dto);

    expect(article.author).toBe("우울한 대포수");
  });

  it("author가 null이면 빈 문자열로 두고 authorUsername으로 대체하지 않는다", () => {
    const dto = postDetailResponseDtoSchema.parse({
      postId: 3,
      title: "삭제된 게시글",
      content: "",
      thumbnail: null,
      imageNum: 0,
      viewCount: null,
      likedNum: null,
      commentNum: 0,
      timeSincePosted: null,
      timeSincePostedText: null,
      author: null,
      authorUsername: null,
      imageList: null,
      isLiked: null,
      isWriter: null,
      categoryId: null,
    });

    const article = mapPostDetailDtoToArticle(dto);

    expect(article.author).toBe("");
  });
});
