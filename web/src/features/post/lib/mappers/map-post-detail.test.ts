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
    expect(article.commentList).toHaveLength(1);
    const root = article.commentList[0];
    expect(root?.commentId).toBe(10);
    expect(root?.replies).toHaveLength(1);
    expect(root?.replies[0]?.commentId).toBe(11);
    expect(root?.profile.fullFilePath).toBe(sampleImageProfile.fullFilePath);
  });
});
