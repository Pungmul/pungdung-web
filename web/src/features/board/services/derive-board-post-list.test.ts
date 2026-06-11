import { describe, expect, it } from "vitest";

import type { BoardOverview, PostListPage } from "../types";

import {
  deriveBoardPostList,
  deriveBoardPostListHasNextPage,
} from "./derive-board-post-list";

const postStub = {
  postId: 1,
  title: "t",
  content: "c",
  thumbnail: null,
  imageNum: 0,
  viewCount: 0,
  likedNum: 0,
  commentNum: 0,
  timeSincePosted: 0,
  timeSincePostedText: "",
  author: "",
};

const emptyPostListPage = (): PostListPage => ({
  total: 0,
  list: [],
  pageNum: 0,
  pageSize: 10,
  isFirstPage: true,
  isLastPage: true,
  hasPreviousPage: false,
  hasNextPage: false,
});

const boardDataStub: BoardOverview = {
  boardInfo: {
    rootCategoryName: "root",
    childCategoryName: null,
    childCategories: [],
  },
  hotPost: postStub,
  recentPostList: {
    ...emptyPostListPage(),
    list: [postStub],
  },
};

describe("deriveBoardPostList", () => {
  it("boardData 없으면 빈 배열", () => {
    expect(deriveBoardPostList(undefined, undefined)).toEqual([]);
  });

  it("boardData 없어도 무한 첫 페이지에 글이 있으면 그 목록 사용", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [postStub],
    };
    expect(deriveBoardPostList(undefined, { pages: [page] })).toEqual([
      postStub,
    ]);
  });

  it("무한 첫 페이지 list가 비었고 boardData 없으면 빈 배열(상세 로드 대기)", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [],
    };
    expect(deriveBoardPostList(undefined, { pages: [page] })).toEqual([]);
  });

  it("무한 첫 페이지가 비었고 boardData 있으면 recentPostList로 폴백", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [],
    };
    expect(deriveBoardPostList(boardDataStub, { pages: [page] })).toEqual(
      boardDataStub.recentPostList.list
    );
  });

  it("무한 스크롤 데이터 없으면 recentPostList.list 사용", () => {
    expect(deriveBoardPostList(boardDataStub, undefined)).toEqual(
      boardDataStub.recentPostList.list
    );
  });

  it("무한 스크롤 페이지가 있으면 페이지 list를 평탄화", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [postStub],
    };
    expect(
      deriveBoardPostList(boardDataStub, { pages: [page] })
    ).toEqual([postStub]);
  });
});

describe("deriveBoardPostListHasNextPage", () => {
  it("boardData 없으면 false", () => {
    expect(
      deriveBoardPostListHasNextPage(undefined, undefined, false)
    ).toBe(false);
  });

  it("boardData 없어도 무한 페이지에 글이 있으면 무한 쿼리 hasNextPage", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [postStub],
    };
    expect(
      deriveBoardPostListHasNextPage(undefined, { pages: [page] }, true)
    ).toBe(true);
    expect(
      deriveBoardPostListHasNextPage(undefined, { pages: [page] }, false)
    ).toBe(false);
  });

  it("무한 첫 페이지 비었고 boardData 없으면 false", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [],
    };
    expect(
      deriveBoardPostListHasNextPage(undefined, { pages: [page] }, true)
    ).toBe(false);
  });

  it("무한 첫 페이지 비었고 boardData 있으면 recentPostList.hasNextPage", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [],
    };
    const board: BoardOverview = {
      ...boardDataStub,
      recentPostList: {
        ...boardDataStub.recentPostList,
        hasNextPage: true,
      },
    };
    expect(
      deriveBoardPostListHasNextPage(board, { pages: [page] }, false)
    ).toBe(true);
  });

  it("무한 쿼리 페이지 없으면 recentPostList.hasNextPage 사용", () => {
    const board: BoardOverview = {
      ...boardDataStub,
      recentPostList: {
        ...boardDataStub.recentPostList,
        hasNextPage: true,
      },
    };
    expect(
      deriveBoardPostListHasNextPage(board, undefined, false)
    ).toBe(true);
  });

  it("무한 쿼리 페이지 있으면 쿼리 hasNextPage 사용", () => {
    const page: PostListPage = {
      ...emptyPostListPage(),
      list: [postStub],
    };
    expect(
      deriveBoardPostListHasNextPage(boardDataStub, { pages: [page] }, true)
    ).toBe(true);
    expect(
      deriveBoardPostListHasNextPage(boardDataStub, { pages: [page] }, false)
    ).toBe(false);
  });
});
