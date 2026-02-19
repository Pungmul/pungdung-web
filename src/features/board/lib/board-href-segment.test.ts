import { describe, expect, it } from "vitest";

import {
  PROMOTE_BOARD_SEGMENT,
  boardHrefSegment,
  isPromoteBoard,
} from "./board-href-segment";

describe("boardHrefSegment", () => {
  it("문자열 id promote는 경로 promote", () => {
    expect(boardHrefSegment(PROMOTE_BOARD_SEGMENT)).toBe("promote");
  });

  it("일반 숫자 id는 문자열로", () => {
    expect(boardHrefSegment(3)).toBe("3");
  });

  it("문자열 id는 그대로", () => {
    expect(boardHrefSegment("hot-post")).toBe("hot-post");
  });
});

describe("isPromoteBoard", () => {
  it("문자열 promote만 true", () => {
    expect(isPromoteBoard(PROMOTE_BOARD_SEGMENT)).toBe(true);
    expect(isPromoteBoard(999_999)).toBe(false);
    expect(isPromoteBoard(1)).toBe(false);
  });
});
