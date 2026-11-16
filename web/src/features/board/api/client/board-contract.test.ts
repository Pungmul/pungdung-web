import { describe, expect, it } from "vitest";

import { boardMetadataDtoSchema, boardPostListDtoSchema } from "./dto.schema";

describe("분리된 게시판 응답", () => {
  it("parentId가 없는 개인화된 하위 게시판 정보를 허용한다", () => {
    const result = boardMetadataDtoSchema.safeParse({
      currentCategoryId: 8,
      boardInfo: {
        rootCategoryId: 8,
        rootCategoryName: "동아리 게시판",
        childCategoryName: null,
        isPublic: false,
        childCategories: [{ id: 30, name: "모임 A", description: "가상 학교 A 모임 게시판", isPublic: false }],
      },
    });
    expect(result.success).toBe(true);
  });

  it("boardInfo 없는 목록과 첫 페이지의 인기글을 허용한다", () => {
    const result = boardPostListDtoSchema.safeParse({
      currentCategoryId: 30,
      hotPost: { postId: 1, title: "인기글" },
      recentPostList: {
        total: 0, list: [], pageNum: 1, pageSize: 10,
        isFirstPage: true, isLastPage: true, hasPreviousPage: false, hasNextPage: false,
      },
    });
    expect(result.success).toBe(true);
  });
});
