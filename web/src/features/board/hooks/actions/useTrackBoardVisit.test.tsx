import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useFrequentBoard } from "../../store";
import type { BoardOverview } from "../../types";

import { useTrackBoardVisit } from "./useTrackBoardVisit";

const boardWithoutChildren: BoardOverview = {
  currentCategoryId: 1,
  boardInfo: {
    rootCategoryId: 1,
    rootCategoryName: "자유 게시판",
    childCategoryName: null,
    isPublic: true,
    childCategories: [],
  },
  hotPost: null,
  recentPostList: {
    total: 0,
    list: [],
    pageNum: 0,
    pageSize: 10,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
  },
};

const boardWithChildren: BoardOverview = {
  ...boardWithoutChildren,
  currentCategoryId: 10,
  boardInfo: {
    rootCategoryId: 10,
    rootCategoryName: "악기 게시판",
    childCategoryName: "장구 게시판",
    isPublic: true,
    childCategories: [
      {
        id: 201,
        parentId: 10,
        name: "장구 게시판",
        description: null,
      },
    ],
  },
};

describe("useTrackBoardVisit", () => {
  beforeEach(() => {
    localStorage.clear();
    useFrequentBoard.setState({ boardList: [] });
  });

  it("자식이 없으면 루트 이름만 저장한다", () => {
    renderHook(() =>
      useTrackBoardVisit({
        boardId: 1,
        boardData: boardWithoutChildren,
        selectedCategory: undefined,
      })
    );

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 1, name: "자유 게시판" },
    ]);
  });

  it("자식 탭이면 자식 이름과 tabId를 저장한다", () => {
    renderHook(() =>
      useTrackBoardVisit({
        boardId: 10,
        boardData: boardWithChildren,
        selectedCategory: boardWithChildren.boardInfo.childCategories[0],
      })
    );

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 10, tabId: 201, name: "장구 게시판" },
    ]);
  });

  it("자식이 있는데 선택이 없으면 저장하지 않는다", () => {
    renderHook(() =>
      useTrackBoardVisit({
        boardId: 10,
        boardData: boardWithChildren,
        selectedCategory: undefined,
      })
    );

    expect(useFrequentBoard.getState().boardList).toEqual([]);
  });
});
