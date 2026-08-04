import { describe, expect, it } from "vitest";

import {
  commentListResponseDtoSchema,
  createCommentRequestDtoSchema,
  createReplyRequestDtoSchema,
  myCommentListPageDtoSchema,
  reportCommentRequestDtoSchema,
} from "./dto.schema";

describe("comment dto.schema", () => {
  it("commentListResponseDtoSchema는 평면 댓글 목록을 검증한다", () => {
    const parsed = commentListResponseDtoSchema.safeParse([
      {
        commentId: 1,
        postId: 10,
        parentId: null,
        content: "댓글입니다.",
        deleted: false,
        hide: false,
        anonymity: false,
        likedNum: 0,
        userName: "작성자",
        createdAt: "2026-01-01",
      },
      {
        commentId: 2,
        postId: 10,
        parentId: 1,
        content: "대댓글입니다.",
        deleted: true,
        hide: false,
        anonymity: true,
        likedNum: null,
        userName: "답글 작성자",
        createdAt: "2026-01-02",
      },
    ]);

    expect(parsed.success).toBe(true);
  });

  it("댓글의 deleted, hide와 null 추천 수를 검증한다", () => {
    const parsed = commentListResponseDtoSchema.safeParse([
      {
        commentId: 1,
        postId: 10,
        parentId: null,
        content: "삭제된 댓글입니다.",
        userName: "작성자",
        deleted: true,
        hide: false,
        anonymity: true,
        likedNum: null,
        createdAt: "07/21 14:09",
      },
    ]);

    expect(parsed.success).toBe(true);
  });

  it("createCommentRequestDtoSchema는 댓글 작성 payload를 통과시킨다", () => {
    const parsed = createCommentRequestDtoSchema.safeParse({
      content: "댓글입니다.",
      anonymity: false,
    });

    expect(parsed.success).toBe(true);
  });

  it("createReplyRequestDtoSchema는 parentId가 있는 대댓글 작성 payload를 통과시킨다", () => {
    const parsed = createReplyRequestDtoSchema.safeParse({
      content: "대댓글입니다.",
      parentId: 1,
      anonymity: true,
    });

    expect(parsed.success).toBe(true);
  });

  it("createReplyRequestDtoSchema는 parentId가 숫자가 아니면 실패한다", () => {
    const parsed = createReplyRequestDtoSchema.safeParse({
      content: "대댓글입니다.",
      parentId: "1",
      anonymity: true,
    });

    expect(parsed.success).toBe(false);
  });

  it("reportCommentRequestDtoSchema는 지원하는 신고 사유만 통과시킨다", () => {
    const parsed = reportCommentRequestDtoSchema.safeParse({
      reportReason: "SPAM",
    });

    expect(parsed.success).toBe(true);
  });

  it("reportCommentRequestDtoSchema는 지원하지 않는 신고 사유에서 실패한다", () => {
    const parsed = reportCommentRequestDtoSchema.safeParse({
      reportReason: "UNKNOWN",
    });

    expect(parsed.success).toBe(false);
  });

  it("myCommentListPageDtoSchema는 내 댓글 페이지 payload를 검증한다", () => {
    const parsed = myCommentListPageDtoSchema.safeParse({
      total: 1,
      list: [
        {
          id: 1,
          postId: 10,
          parentId: null,
          content: "댓글입니다.",
          deleted: false,
          likedNum: 0,
          createdAt: "2026-01-01",
          updatedAt: "2026-01-02",
          postTitle: "게시글 제목",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      size: 1,
      startRow: 1,
      endRow: 1,
      pages: 1,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
    });

    expect(parsed.success).toBe(true);
  });
});
