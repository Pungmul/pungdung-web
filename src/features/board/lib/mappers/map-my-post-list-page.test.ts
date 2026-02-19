import { describe, expect, it } from "vitest";

import { mapMyPostRowToSummaryWithCategory } from "./map-my-post-list-page";

describe("mapMyPostRowToSummaryWithCategory", () => {
  it("목록 한 줄 DTO를 파싱해 썸네일·본문 필드를 옮긴다", () => {
    const row = {
      postId: 2,
      title: "t",
      content: "c",
      thumbnail: null,
      imageNum: 0,
      viewCount: 1,
      likedNum: 0,
      commentNum: 0,
      timeSincePosted: 0,
      timeSincePostedText: "x",
      author: "a",
      categoryName: "자유",
    };

    const summary = mapMyPostRowToSummaryWithCategory(row);

    expect(summary.postId).toBe(2);
    expect(summary.categoryName).toBe("자유");
    expect(summary.thumbnail).toBeNull();
  });
});
