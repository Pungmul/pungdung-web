import { describe, expect, it } from "vitest";

import { addressToString } from "./address-to-string";

describe("addressToString", () => {
  it("joins buildingName and detail", () => {
    expect(
      addressToString({
        latitude: 0,
        longitude: 0,
        buildingName: "A빌",
        detail: "101호",
      })
    ).toBe("A빌, 101호");
  });
});
