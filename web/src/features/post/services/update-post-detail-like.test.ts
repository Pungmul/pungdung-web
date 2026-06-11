import { describe, expect, it } from "vitest";

import type { PostArticleDetail, PostLikeSnapshot } from "../types";

import { updatePostDetailLike } from "./update-post-detail-like";

function makeDetail(overrides: Partial<PostArticleDetail> = {}): PostArticleDetail {
  const baseImage = {
    id: 0,
    originalFilename: "",
    convertedFileName: "",
    fullFilePath: "",
    fileType: "image/jpeg",
    fileSize: 0,
    createdAt: "",
  };
  const baseComment = {} as unknown as PostArticleDetail["commentList"][0];

  const base = {
    postId: 1,
    title: "t",
    content: "",
    thumbnail: baseImage,
    imageNum: 0,
    viewCount: 0,
    likedNum: 0,
    commentNum: 0,
    timeSincePosted: 0,
    timeSincePostedText: "",
    author: "",
    imageList: [baseImage],
    commentList: [baseComment],
    isLiked: false,
    isWriter: true,
    categoryId: 1,
    ...overrides,
  };

  return base;
}

describe("updatePostDetailLike", () => {
  it("oldData가 null이면 그대로 null을 반환한다", () => {
    const snap: PostLikeSnapshot = {
      postId: 1,
      liked: true,
      likedNum: 99,
    };
    expect(updatePostDetailLike(null, snap)).toBeNull();
  });

  it("oldData가 undefined이면 그대로 undefined를 반환한다", () => {
    const snap: PostLikeSnapshot = {
      postId: 1,
      liked: true,
      likedNum: 99,
    };
    expect(updatePostDetailLike(undefined, snap)).toBeUndefined();
  });

  it("likedNum과 isLiked만 스냅샷으로 갱신하고 나머지 필드는 유지한다", () => {
    const old = makeDetail({
      postId: 42,
      title: "제목",
      likedNum: 1,
      isLiked: false,
    });
    const snap: PostLikeSnapshot = {
      postId: 42,
      liked: true,
      likedNum: 5,
    };

    const next = updatePostDetailLike(old, snap);
    expect(next).toEqual({
      ...old,
      likedNum: 5,
      isLiked: true,
    });
  });
});
