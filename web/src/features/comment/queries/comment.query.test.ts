import { describe, expect, it } from "vitest";

import { commentQueries } from "./comment.query";

describe("commentQueries", () => {
  it("게시글별 댓글 목록 키를 분리한다", () => {
    expect(commentQueries.listKey(10)).toEqual(["comment", "list", 10]);
    expect(commentQueries.list(10).queryKey).toEqual([
      "comment",
      "list",
      10,
    ]);
  });
});
