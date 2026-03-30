import { describe, expect, it } from "vitest";

import type { BoardSummary } from "../types";

import { sortBoardsWithBookmarks } from "./sort-boards-with-bookmarks";

const a: BoardSummary = {
  id: 1,
  parentId: null,
  name: "A",
  description: "",
};
const b: BoardSummary = {
  id: 2,
  parentId: null,
  name: "B",
  description: "",
};
const c: BoardSummary = {
  id: "x",
  parentId: null,
  name: "X",
  description: "",
};
const club: BoardSummary = {
  id: "club",
  parentId: null,
  name: "동아리 게시판",
  description: "",
};
const promote: BoardSummary = {
  id: "promote",
  parentId: null,
  name: "홍보 게시판",
  description: "",
};

describe("sortBoardsWithBookmarks", () => {
  it("북마크된 보드가 앞으로 온다", () => {
    expect(
      sortBoardsWithBookmarks([a, b], [2])
    ).toEqual([b, a]);
  });

  it("북마크가 없으면 숫자 id 오름차순", () => {
    expect(sortBoardsWithBookmarks([b, a], [])).toEqual([a, b]);
  });

  it("문자열 id는 로케일 비교", () => {
    expect(sortBoardsWithBookmarks([c, a], [])).toEqual([a, c]);
  });

  it("합성 게시판 중 동아리 게시판은 홍보 게시판보다 앞에 온다", () => {
    expect(sortBoardsWithBookmarks([promote, club], [])).toEqual([
      club,
      promote,
    ]);
  });
});
