import { describe, expect, it } from "vitest";

import {
  formatPromotionDate,
  formatPromotionTime,
} from "./format-promotion-date-time";

describe("formatPromotionDate", () => {
  it('returns "미정" when startAt missing', () => {
    expect(formatPromotionDate(null)).toBe("미정");
    expect(formatPromotionDate(undefined)).toBe("미정");
    expect(formatPromotionDate("")).toBe("미정");
  });

  it("formats local datetime string", () => {
    const s = formatPromotionDate("2025-07-04T12:00:00");
    expect(s).toMatch(/^2025\.07\.04\(/);
  });
});

describe("formatPromotionTime", () => {
  it('returns "미정" when startAt missing', () => {
    expect(formatPromotionTime(null)).toBe("미정");
  });

  it("prefixes morning vs afternoon for local noon", () => {
    expect(formatPromotionTime("2025-01-01T08:00:00")).toMatch(/^이른 /);
    expect(formatPromotionTime("2025-01-01T18:00:00")).toMatch(/^늦은 /);
  });
});
