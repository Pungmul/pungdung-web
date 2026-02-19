import { describe, expect, it } from "vitest";

import type { PostSummaryWithCategory } from "@/features/post";

import type { HotPostListPageDto } from "./fetch-hot-post-list";
import { mapHotPostListDtoToResponse } from "./fetch-hot-post-list";

const minimalRow: PostSummaryWithCategory = {
  postId: 1,
  title: "",
  content: "",
  thumbnail: null,
  imageNum: 0,
  viewCount: 0,
  likedNum: 0,
  commentNum: 0,
  timeSincePosted: 0,
  timeSincePostedText: "",
  author: "",
  categoryName: "",
};

function dto(overrides: Partial<HotPostListPageDto> = {}): HotPostListPageDto {
  return {
    total: 25,
    list: [minimalRow],
    pageNum: 1,
    pageSize: 10,
    ...overrides,
  };
}

describe("mapHotPostListDtoToResponse", () => {
  it("첫 페이지에서 아직 로드한 수가 total 미만이면 hasNextPage는 true", () => {
    const result = mapHotPostListDtoToResponse(dto());
    expect(result.hasNextPage).toBe(true);
  });

  it("마지막 페이지에서 loaded가 total 이상이면 hasNextPage는 false", () => {
    const list = Array.from({ length: 10 }, (_, i) => ({
      ...minimalRow,
      postId: 11 + i,
    }));
    const result = mapHotPostListDtoToResponse(
      dto({
        total: 20,
        pageNum: 2,
        pageSize: 10,
        list,
      })
    );
    expect(result.hasNextPage).toBe(false);
  });

  it("빈 list와 total 0이면 hasNextPage는 false", () => {
    const result = mapHotPostListDtoToResponse(
      dto({ total: 0, list: [] })
    );
    expect(result.hasNextPage).toBe(false);
  });

  it("dto list 참조는 응답 list에 그대로 유지된다", () => {
    const customList = [{ ...minimalRow, postId: 99 }];
    const input = dto({ list: customList });
    const result = mapHotPostListDtoToResponse(input);
    expect(result.list).toBe(customList);
  });
});
