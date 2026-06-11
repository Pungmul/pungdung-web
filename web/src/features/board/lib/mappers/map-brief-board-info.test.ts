import { describe, expect, it } from "vitest";

import { mapBriefBoardInfoDtoToBoardSummary } from "./map-brief-board-info";

describe("mapBriefBoardInfoDtoToBoardSummary", () => {
  it("필드를 그대로 옮긴다", () => {
    const dto = {
      id: 1,
      parentId: null as number | null,
      name: "자유",
      description: "desc",
    };
    expect(mapBriefBoardInfoDtoToBoardSummary(dto)).toEqual({
      id: 1,
      parentId: null,
      name: "자유",
      description: "desc",
    });
  });
});
