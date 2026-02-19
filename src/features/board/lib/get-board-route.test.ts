import { describe, expect, it } from "vitest";

import { getBoardRoute } from "./get-board-route";

describe("getBoardRoute", () => {
  it("숫자 id를 경로에 넣는다", () => {
    expect(getBoardRoute(42)).toBe("/board/42");
  });

  it("문자열 id를 그대로 넣는다", () => {
    expect(getBoardRoute("promote")).toBe("/board/promote");
  });
});
