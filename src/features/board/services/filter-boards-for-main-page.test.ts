import { describe, expect, it } from "vitest";

import type { BoardSummary } from "../types";

import { filterBoardsForMainPage } from "./filter-boards-for-main-page";

const sample: BoardSummary[] = [
  {
    id: 1,
    parentId: null,
    name: "자유",
    description: "",
  },
  {
    id: "club",
    parentId: null,
    name: "동아리",
    description: "",
  },
  {
    id: "promote",
    parentId: null,
    name: "홍보",
    description: "",
  },
  {
    id: "other-string",
    parentId: null,
    name: "제외",
    description: "",
  },
];

describe("filterBoardsForMainPage", () => {
  it("숫자 id와 club, promote 합성 게시판만 남김", () => {
    expect(filterBoardsForMainPage(sample)).toEqual([
      sample[0],
      sample[1],
      sample[2],
    ]);
  });
});
