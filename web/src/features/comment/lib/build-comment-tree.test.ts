import { describe, expect, it } from "vitest";

import type { Comment } from "../types";

import { buildCommentTree } from "./build-comment-tree";

const profileStub = {
  id: 1,
  originalFilename: "profile.png",
  convertedFileName: "profile.webp",
  fullFilePath: "/profile.webp",
  fileType: "image/webp",
  fileSize: 100,
  createdAt: "2026-01-01",
};

function createComment(overrides: Partial<Comment>): Comment {
  return {
    commentId: 1,
    postId: 10,
    parentId: null,
    content: "댓글",
    userName: "작성자",
    profile: profileStub,
    createdAt: "2026-01-01",
    replies: [],
    ...overrides,
  };
}

describe("buildCommentTree", () => {
  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it("평면 댓글 목록을 부모 댓글 기준 트리로 묶는다", () => {
    const comments = [
      createComment({ commentId: 1, parentId: null }),
      createComment({ commentId: 2, parentId: 1, content: "대댓글" }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.commentId).toBe(1);
    expect(tree[0]?.replies).toHaveLength(1);
    expect(tree[0]?.replies[0]?.commentId).toBe(2);
  });

  it("부모 댓글이 없으면 해당 대댓글은 결과에서 제외한다", () => {
    const comments = [
      createComment({ commentId: 2, parentId: 999, content: "고아 댓글" }),
    ];

    expect(buildCommentTree(comments)).toEqual([]);
  });

  it("원본 댓글 객체를 변경하지 않는다", () => {
    const child = createComment({ commentId: 2, parentId: 1 });
    const parent = createComment({ commentId: 1, parentId: null });

    buildCommentTree([child, parent]);

    expect(parent.replies).toEqual([]);
    expect(child.replies).toEqual([]);
  });
});
