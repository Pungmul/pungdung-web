import { describe, expect, it } from "vitest";

import { postDetailResponseDtoSchema } from "../../api/client/dto.schema";

import { mapPostDetailDtoToArticle } from "./map-post-detail";

const sampleImageProfile = {
  id: 1,
  originalFilename: "orig.png",
  convertedFileName: "conv.png",
  fullFilePath: "https://example.com/img.png",
  fileType: "image/png",
  fileSize: 100,
  createdAt: "2020-01-01",
};

describe("mapPostDetailDtoToArticle", () => {
  it("검증된 상세 DTO를 도메인 모델로 펼치고 댓글 트리를 유지한다", () => {
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
      commentList: [
        {
          commentId: 10,
          postId: 1,
          parentId: null,
          content: "댓글",
          userName: "유저",
          profile: sampleImageProfile,
          createdAt: "2020-01-01",
          replies: [
            {
              commentId: 11,
              postId: 1,
              parentId: 10,
              content: "대댓",
              userName: "유저2",
              profile: sampleImageProfile,
              createdAt: "2020-01-02",
              replies: [],
            },
          ],
        },
      ],
      isLiked: false,
      isWriter: true,
      categoryId: 7,
    };

    const dto = postDetailResponseDtoSchema.parse(raw);
    const article = mapPostDetailDtoToArticle(dto);

    expect(article.postId).toBe(1);
    expect(article.thumbnail).toBeNull();
    expect(article.author).toBe("작성자");
    expect(article.commentList).toHaveLength(1);
    const root = article.commentList[0];
    expect(root?.commentId).toBe(10);
    expect(root?.replies).toHaveLength(1);
    expect(root?.replies[0]?.commentId).toBe(11);
    expect(root?.profile.fullFilePath).toBe(sampleImageProfile.fullFilePath);
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
      commentList: [],
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
      commentList: null,
      isLiked: null,
      isWriter: null,
      categoryId: null,
    });

    const article = mapPostDetailDtoToArticle(dto);

    expect(article.author).toBe("");
  });
});
