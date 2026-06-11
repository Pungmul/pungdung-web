import { describe, expect,it } from "vitest";

import { formatPhoneNumber } from "./format-phone-number";

describe("formatPhoneNumber", () => {
  it("strips non-digits", () => {
    expect(formatPhoneNumber("010a12b34")).toBe("010-1234");
  });

  it("returns up to 3 digits without dash", () => {
    expect(formatPhoneNumber("010")).toBe("010");
  });

  it("formats 4–7 digits as 3-4", () => {
    expect(formatPhoneNumber("0101234")).toBe("010-1234");
  });

  it("formats 8–10 digits as 3-3-4 (mobile-style)", () => {
    expect(formatPhoneNumber("0101234567")).toBe("010-123-4567");
  });

  it("formats 11 digits as 3-4-4", () => {
    expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
  });

  it("uses first 11 digits only when input exceeds 11 digits", () => {
    expect(formatPhoneNumber("010123456789992222")).toBe("010-1234-5678");
  });
});
