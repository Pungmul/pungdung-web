import { describe, expect, it } from "vitest";

import {
  CLUB_BOARD_SEGMENT,
  PROMOTE_BOARD_SEGMENT,
  boardHrefSegment,
  isClubBoard,
  isPromoteBoard,
} from "./board-href-segment";

describe("boardHrefSegment", () => {
  it("문자열 id promote는 경로 promote", () => {
    expect(boardHrefSegment(PROMOTE_BOARD_SEGMENT)).toBe("promote");
  });

  it("문자열 id club은 경로 club", () => {
    expect(boardHrefSegment(CLUB_BOARD_SEGMENT)).toBe("club");
  });

  it("일반 숫자 id는 문자열로", () => {
    expect(boardHrefSegment(3)).toBe("3");
  });

  it("문자열 id는 그대로", () => {
    expect(boardHrefSegment("hot-post")).toBe("hot-post");
  });
});

describe("isClubBoard", () => {
  it("문자열 club만 true", () => {
    expect(isClubBoard(CLUB_BOARD_SEGMENT)).toBe(true);
    expect(isClubBoard(PROMOTE_BOARD_SEGMENT)).toBe(false);
    expect(isClubBoard(1)).toBe(false);
  });
});

describe("isPromoteBoard", () => {
  it("문자열 promote만 true", () => {
    expect(isPromoteBoard(PROMOTE_BOARD_SEGMENT)).toBe(true);
    expect(isPromoteBoard(999_999)).toBe(false);
    expect(isPromoteBoard(1)).toBe(false);
  });
});
