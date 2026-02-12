import { describe, expect, it } from "vitest";

import { lightningQueryInternal } from "./lightning-query-internal";

describe("lightningQueryInternal", () => {
  it("루트와 하위 키가 안정적인 튜플 형태다", () => {
    expect(lightningQueryInternal.all()).toEqual(["lightning"]);
    expect(lightningQueryInternal.data()).toEqual(["lightning", "data"]);
    expect(lightningQueryInternal.status()).toEqual(["lightning", "status"]);
  });

  it("list 필터가 있으면 키에 포함한다", () => {
    expect(lightningQueryInternal.list({ target: "전체" })).toEqual([
      "lightning",
      "list",
      { target: "전체" },
    ]);
  });
});
