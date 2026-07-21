import { describe, expect, it } from "vitest";

import {
  boardDataDtoSchema,
  briefBoardInfoListDtoSchema,
  hotPostListResponseDtoSchema,
  myCommentListPageDtoSchema,
  myPostListPageDtoSchema,
  postListPageDtoSchema,
  postWithCategoryNameDtoSchema,
} from "./dto.schema";

function minimalPostWithCategoryRow(overrides: Record<string, unknown> = {}) {
  return {
    postId: 1,
    title: "제목",
    content: "본문",
    thumbnail: null,
    imageNum: 0,
    viewCount: 0,
    likedNum: 0,
    commentNum: 0,
    timeSincePosted: 0,
    timeSincePostedText: "방금",
    author: "작성자",
    categoryName: "카테고리",
    ...overrides,
  };
}

describe("board dto.schema", () => {
  it("briefBoardInfoListDtoSchema는 게시판 목록 배열을 통과시킨다", () => {
    const parsed = briefBoardInfoListDtoSchema.safeParse([
      {
        id: 1,
        parentId: null,
        name: "자유",
        description: "desc",
        isPublic: true,
      },
    ]);
    expect(parsed.success).toBe(true);
  });

  it("briefBoardInfoListDtoSchema는 잘못된 요소에서 실패한다", () => {
    const parsed = briefBoardInfoListDtoSchema.safeParse([
      { id: "x", parentId: null, name: 1, description: "d", isPublic: true },
    ]);
    expect(parsed.success).toBe(false);
  });

  it("postListPageDtoSchema는 PageHelper 추가 필드(navigatepageNums 등)가 있어도 통과한다", () => {
    const parsed = postListPageDtoSchema.safeParse({
      total: 10,
      list: [{ postId: 1 }],
      pageNum: 1,
      pageSize: 10,
      size: 10,
      navigatepageNums: [1, 2, 3],
      isFirstPage: true,
      isLastPage: false,
      hasPreviousPage: false,
      hasNextPage: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("boardDataDtoSchema는 boardInfo.rootCategoryName이 null이어도 통과한다", () => {
    const parsed = boardDataDtoSchema.safeParse({
      currentCategoryId: 1,
      boardInfo: {
        rootCategoryId: 1,
        rootCategoryName: null,
        childCategoryName: null,
        isPublic: true,
      },
      hotPost: { postId: null },
      recentPostList: {
        total: 10,
        list: [],
        pageNum: 1,
        pageSize: 10,
        isFirstPage: true,
        isLastPage: false,
        hasPreviousPage: false,
        hasNextPage: true,
      },
    });
    expect(parsed.success).toBe(true);
  });

  it("boardDataDtoSchema는 childCategories를 게시판 정보 안에서 통과시킨다", () => {
    const parsed = boardDataDtoSchema.safeParse({
      currentCategoryId: 4,
      boardInfo: {
        rootCategoryId: 3,
        rootCategoryName: "악기 게시판",
        childCategoryName: null,
        isPublic: true,
        childCategories: [
          {
            id: 4,
            parentId: null,
            name: "쇠",
            description: null,
          },
        ],
      },
      hotPost: null,
      recentPostList: {
        total: 0,
        list: [],
        pageNum: 1,
        pageSize: 10,
        isFirstPage: true,
        isLastPage: true,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      throw new Error("childCategories should parse");
    }
    expect(parsed.data?.boardInfo.childCategories).toEqual([
      {
        id: 4,
        parentId: null,
        name: "쇠",
        description: null,
      },
    ]);
  });

  it("postWithCategoryNameDtoSchema는 필수 필드가 있으면 통과한다", () => {
    const parsed = postWithCategoryNameDtoSchema.safeParse(
      minimalPostWithCategoryRow()
    );
    expect(parsed.success).toBe(true);
  });

  it("postWithCategoryNameDtoSchema는 필수 필드 누락 시 실패한다", () => {
    const parsed = postWithCategoryNameDtoSchema.safeParse({
      postId: 1,
      title: "t",
    });
    expect(parsed.success).toBe(false);
  });

  it("hotPostListResponseDtoSchema는 목록·페이징 필드가 맞으면 통과한다", () => {
    const parsed = hotPostListResponseDtoSchema.safeParse({
      total: 100,
      list: [
        minimalPostWithCategoryRow({ postId: 1 }),
        minimalPostWithCategoryRow({ postId: 2, title: "두 번째" }),
      ],
      pageNum: 1,
      pageSize: 10,
    });
    expect(parsed.success).toBe(true);
  });

  it("hotPostListResponseDtoSchema는 list 필드 타입이 맞지 않으면 실패한다", () => {
    const parsed = hotPostListResponseDtoSchema.safeParse({
      total: 10,
      list: [{ invalid: true }],
      pageNum: 1,
      pageSize: 10,
    });
    expect(parsed.success).toBe(false);
  });

  it("myPostListPageDtoSchema는 추가 필드가 있어도 passthrough로 통과한다", () => {
    const parsed = myPostListPageDtoSchema.safeParse({
      total: 3,
      list: [{ id: 1 }],
      pageNum: 2,
      pageSize: 20,
      extraField: "kept",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.extraField).toBe("kept");
    }
  });

  it("myPostListPageDtoSchema는 필수 페이징 필드가 없으면 실패한다", () => {
    const parsed = myPostListPageDtoSchema.safeParse({
      total: 3,
      list: [],
    });
    expect(parsed.success).toBe(false);
  });

  it("myCommentListPageDtoSchema는 추가 필드가 있어도 passthrough로 통과한다", () => {
    const parsed = myCommentListPageDtoSchema.safeParse({
      total: 5,
      list: [],
      pageNum: 1,
      pageSize: 10,
      commentMeta: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.commentMeta).toBe(true);
    }
  });

  it("myCommentListPageDtoSchema는 pageSize 타입이 잘못되면 실패한다", () => {
    const parsed = myCommentListPageDtoSchema.safeParse({
      total: 5,
      list: [],
      pageNum: 1,
      pageSize: "10",
    });
    expect(parsed.success).toBe(false);
  });
});
