import { describe, expect, it } from "vitest";

import type { BoardSummary } from "../types";

import { resolveFreeBoardHref } from "./resolve-free-board-href";

const boards: BoardSummary[] = [
  {
    id: 1,
    parentId: null,
    name: "자유게시판",
    description: "",
  },
  {
    id: 2,
    parentId: null,
    name: "기타",
    description: "",
  },
];

describe("resolveFreeBoardHref", () => {
  it("이름에 기본 힌트(자유)가 포함된 보드를 고른다", () => {
    expect(resolveFreeBoardHref(boards)).toBe("/board/1");
  });

  it("매칭이 없으면 id 1로 폴백한다", () => {
    expect(
      resolveFreeBoardHref(
        [{ id: 2, parentId: null, name: "없음", description: "" }],
        { nameHint: "자유" }
      )
    ).toBe("/board/1");
  });

  it("nameHint 옵션으로 매칭한다", () => {
    expect(resolveFreeBoardHref(boards, { nameHint: "기타" })).toBe("/board/2");
  });
});
