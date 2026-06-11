import { describe, expect, it } from "vitest";

import type { MyCommentListPageDto } from "../../api/client";

import { mapMyCommentListPageDtoToResponse } from "./map-my-comment-list-page-dto";

const pageDto: MyCommentListPageDto = {
  total: 1,
  list: [
    {
      id: 1,
      postId: 10,
      parentId: null,
      content: "댓글",
      deleted: false,
      likedNum: 3,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
      postTitle: "게시글",
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
};

describe("mapMyCommentListPageDtoToResponse", () => {
  it("내 댓글 페이지 DTO를 도메인 응답으로 변환한다", () => {
    const response = mapMyCommentListPageDtoToResponse(pageDto);

    expect(response.total).toBe(1);
    expect(response.list[0]).toEqual(pageDto.list[0]);
    expect(response.navigatepageNums).toEqual([1]);
  });
});
