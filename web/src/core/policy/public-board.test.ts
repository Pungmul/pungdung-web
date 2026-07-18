import { describe, expect, it } from "vitest";

import { isPublicBoardId } from "./public-board";

describe("isPublicBoardId", () => {
  it.each([1, "3", 4, "5", 6, "promote"]) (
    "treats %s as a public board",
    (boardId) => {
      expect(isPublicBoardId(boardId)).toBe(true);
    }
  );

  it.each([2, "7", "club"]) (
    "treats %s as a member-only board",
    (boardId) => {
      expect(isPublicBoardId(boardId)).toBe(false);
    }
  );
});
