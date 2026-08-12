import { describe, expect, it } from "vitest";

import { getBoardRoute } from "./get-board-route";

describe("getBoardRoute", () => {
  it("숫자 id를 경로에 넣는다", () => {
    expect(getBoardRoute(42)).toBe("/board/42");
  });

  it("홍보는 목록 경로로 보낸다", () => {
    expect(getBoardRoute("promote")).toBe(
      "/board/promote/l?tab=promotion-list"
    );
    expect(getBoardRoute("promote")).not.toBe("/board/promote");
  });

  it("tabId가 있으면 쿼리를 붙인다", () => {
    expect(getBoardRoute(10, 201)).toBe("/board/10?tab=201");
  });
});
