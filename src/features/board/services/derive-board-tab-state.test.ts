import { describe, expect, it } from "vitest";

import type { BoardChildCategory } from "../types";

import {
  deriveBoardTabState,
  getEffectiveBoardTabCategories,
} from "./derive-board-tab-state";

const category = (
  id: number,
  overrides: Partial<BoardChildCategory> = {}
): BoardChildCategory => ({
  id,
  parentId: 1,
  name: `cat-${id}`,
  description: null,
  ...overrides,
});

describe("getEffectiveBoardTabCategories", () => {
  it("부모 게시판 ID와 동일한 자식 항목을 제외한다", () => {
    const childCategories = [
      category(10),
      category(20),
      category(30, { parentId: 10 }),
    ];

    expect(getEffectiveBoardTabCategories(20, childCategories)).toEqual([
      category(10),
      category(30, { parentId: 10 }),
    ]);
  });
});

describe("deriveBoardTabState", () => {
  const boardId = 100;
  const categories = [category(201), category(202)];

  it("tab 쿼리가 없으면 첫 번째 카테고리를 선택한다", () => {
    const result = deriveBoardTabState({
      boardId,
      categories,
      selectedTabId: null,
      hasChildCategories: true,
    });

    expect(result.selectedCategory).toEqual(categories[0]);
    expect(result.postListBoardId).toBe(201);
    expect(result.shouldNormalizeTabQueryParam).toBe(true);
  });

  it("tab 쿼리가 유효하면 해당 카테고리를 선택하고 URL 정규화는 하지 않는다", () => {
    const result = deriveBoardTabState({
      boardId,
      categories,
      selectedTabId: "202",
      hasChildCategories: true,
    });

    expect(result.selectedCategory).toEqual(categories[1]);
    expect(result.postListBoardId).toBe(202);
    expect(result.shouldNormalizeTabQueryParam).toBe(false);
  });

  it("tab 쿼리가 목록에 없으면 첫 카테고리로 폴백하고 URL을 정규화한다", () => {
    const result = deriveBoardTabState({
      boardId,
      categories,
      selectedTabId: "999",
      hasChildCategories: true,
    });

    expect(result.selectedCategory).toEqual(categories[0]);
    expect(result.shouldNormalizeTabQueryParam).toBe(true);
  });

  it("자식 카테고리가 없으면 루트 boardId로 목록을 조회한다", () => {
    const result = deriveBoardTabState({
      boardId,
      categories: [],
      selectedTabId: null,
      hasChildCategories: false,
    });

    expect(result.selectedCategory).toBeUndefined();
    expect(result.postListBoardId).toBe(boardId);
    expect(result.shouldNormalizeTabQueryParam).toBe(false);
  });
});
