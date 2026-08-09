import { describe, expect, it, vi } from "vitest";

import { getBoardRscMetadataTitle } from "./get-board-rsc-metadata-title";

vi.mock("../api/server/prefetch-board-info-list", () => ({
  prefetchBoardInfoList: vi.fn(),
}));

import { prefetchBoardInfoList } from "../api/server/prefetch-board-info-list";

describe("getBoardRscMetadataTitle", () => {
  it("실패하면 풍덩 | 게시판이다", async () => {
    vi.mocked(prefetchBoardInfoList).mockRejectedValueOnce(new Error("fail"));
    await expect(getBoardRscMetadataTitle("1")).resolves.toBe("풍덩 | 게시판");
  });

  it("string id도 라우트 id와 맞는다", async () => {
    vi.mocked(prefetchBoardInfoList).mockResolvedValueOnce([
      {
        id: "7",
        parentId: null,
        name: "자유",
        description: "d",
        isPublic: true,
      },
    ]);
    await expect(getBoardRscMetadataTitle("7")).resolves.toBe("풍덩 | 자유");
  });
});
