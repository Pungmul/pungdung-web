import { describe, expect, it } from "vitest";

import { getAddressDisplayText } from "./get-address-display-text";
import { getAddressMapTitle } from "./get-address-map-title";

const addr = {
  latitude: 37,
  longitude: 127,
  buildingName: "타워",
  detail: "3층",
};

describe("getAddressDisplayText", () => {
  it('returns "주소 없음" for null', () => {
    expect(getAddressDisplayText(null)).toBe("주소 없음");
  });

  it("prefers detail over buildingName", () => {
    expect(getAddressDisplayText(addr)).toBe("3층");
  });

  it("falls back to buildingName", () => {
    expect(
      getAddressDisplayText({
        ...addr,
        detail: "",
      })
    ).toBe("타워");
  });
});

describe("getAddressMapTitle", () => {
  it("returns empty string for null", () => {
    expect(getAddressMapTitle(null)).toBe("");
  });

  it("matches display preference without 주소 없음 fallback", () => {
    expect(getAddressMapTitle(addr)).toBe("3층");
  });
});
