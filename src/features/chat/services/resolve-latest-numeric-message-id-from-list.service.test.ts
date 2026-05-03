import { describe, expect, it } from "vitest";

import { resolveLatestNumericMessageIdFromList } from "./resolve-latest-numeric-message-id-from-list.service";

describe("resolveLatestNumericMessageIdFromList", () => {
  it("숫자 id 중 최대값을 반환한다", () => {
    expect(
      resolveLatestNumericMessageIdFromList([
        { id: 889 },
        { id: 888 },
        { id: 100 },
      ])
    ).toBe(889);
  });

  it("목록이 비어 있으면 null", () => {
    expect(resolveLatestNumericMessageIdFromList([])).toBeNull();
  });
});
