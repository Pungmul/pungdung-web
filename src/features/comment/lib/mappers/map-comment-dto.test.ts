import { describe, expect, it } from "vitest";

import { mapCommentDtoToComment } from "./map-comment-dto";

const profileDto = {
  id: 1,
  originalFilename: "profile.png",
  convertedFileName: "profile.webp",
  fullFilePath: "/profile.webp",
  fileType: "image/webp",
  fileSize: 100,
  createdAt: "2026-01-01",
};

describe("mapCommentDtoToComment", () => {
  it("댓글 DTO 트리를 도메인 댓글 트리로 변환한다", () => {
    const comment = mapCommentDtoToComment({
      commentId: 1,
      postId: 10,
      parentId: null,
      content: "댓글",
      userName: "작성자",
      profile: profileDto,
      createdAt: "2026-01-01",
      replies: [
        {
          commentId: 2,
          postId: 10,
          parentId: 1,
          content: "대댓글",
          userName: "답글 작성자",
          profile: profileDto,
          createdAt: "2026-01-02",
          replies: [],
        },
      ],
    });

    expect(comment.commentId).toBe(1);
    expect(comment.profile.fullFilePath).toBe(profileDto.fullFilePath);
    expect(comment.replies[0]?.commentId).toBe(2);
  });

  it("삭제 등으로 userName이 null이면 탈퇴한 회원으로 정규화한다", () => {
    const comment = mapCommentDtoToComment({
      commentId: 1,
      postId: 10,
      parentId: null,
      content: "삭제된 댓글입니다.",
      userName: null,
      createdAt: "2026-01-01",
      replies: [],
    });

    expect(comment.userName).toBe("탈퇴한 회원");
  });

  it("필수 댓글 필드가 없으면 실패한다", () => {
    expect(() =>
      mapCommentDtoToComment({
        commentId: 1,
        postId: 10,
        parentId: null,
        content: "댓글",
        profile: profileDto,
        createdAt: "2026-01-01",
        replies: [],
      })
    ).toThrow();
  });
});
