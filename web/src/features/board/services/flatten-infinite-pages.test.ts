import { describe, expect, it } from "vitest";

import { flattenInfinitePages } from "./flatten-infinite-pages";

describe("flattenInfinitePages", () => {
  it("data 없으면 빈 배열", () => {
    expect(flattenInfinitePages(undefined)).toEqual([]);
  });

  it("pages의 list를 순서대로 이어붙임", () => {
    expect(
      flattenInfinitePages({
        pages: [
          { list: [1, 2] },
          { list: [3] },
        ],
      })
    ).toEqual([1, 2, 3]);
  });
});
