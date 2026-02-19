import { describe, expect, it } from "vitest";

import type { BoardDataDto } from "../../api/client/dto.schema";

import { mapBoardDataDtoToBoardOverview } from "./map-board-data";

function minimalRecentPostList(): BoardDataDto["recentPostList"] {
  return {
    total: 0,
    list: [],
    pageNum: 1,
    pageSize: 10,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

describe("mapBoardDataDtoToBoardOverview", () => {
  it("rootCategoryName이 null이면 빈 문자열로 변환한다", () => {
    const dto: BoardDataDto = {
      boardInfo: {
        rootCategoryName: null,
        childCategoryName: "자식",
      },
      hotPost: { postId: 1 },
      recentPostList: minimalRecentPostList(),
    };

    const overview = mapBoardDataDtoToBoardOverview(dto);

    expect(overview.boardInfo.rootCategoryName).toBe("");
    expect(overview.boardInfo.childCategoryName).toBe("자식");
  });

  it("recentPostList와 hotPost 매핑을 유지한다", () => {
    const hotPost = { postId: 42, title: "핫" };
    const recentPostList: BoardDataDto["recentPostList"] = {
      ...minimalRecentPostList(),
      total: 2,
      list: [{ postId: 1 }],
    };

    const dto: BoardDataDto = {
      boardInfo: {
        rootCategoryName: "루트",
        childCategoryName: null,
      },
      hotPost,
      recentPostList,
    };

    const overview = mapBoardDataDtoToBoardOverview(dto);

    expect(overview.hotPost).toEqual(hotPost);
    expect(overview.recentPostList.total).toBe(2);
    expect(overview.recentPostList.list).toEqual([{ postId: 1 }]);
  });
});
