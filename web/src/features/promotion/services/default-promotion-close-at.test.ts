import { describe, expect, it } from "vitest";

import { resolvePromotionCloseAt } from "./default-promotion-close-at";

const today = "2026-09-23";

describe("resolvePromotionCloseAt", () => {
  it("uses a week before the performance date at midnight", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-10-20",
        closeAt: "",
        today,
      })
    ).toBe("2026-10-13T00:00:00");
  });

  it("moves a past close date to the nearest later allowed date", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-10-20",
        closeAt: "2026-09-01T18:30:00",
        today,
      })
    ).toBe("2026-09-24T18:30:00");
  });

  it("moves a week-before date that is today or earlier to tomorrow", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-09-30",
        closeAt: "",
        today,
      })
    ).toBe("2026-09-24T00:00:00");
  });

  it("keeps a close date inside tomorrow and the day before the performance", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-10-20",
        closeAt: "2026-10-10T21:00:00",
        today,
      })
    ).toBe("2026-10-10T21:00:00");
  });

  it("pulls a close date on or after the performance back to the day before", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-10-20",
        closeAt: "2026-10-20T09:00:00",
        today,
      })
    ).toBe("2026-10-19T09:00:00");
  });

  it("returns empty when no date is both after today and before the performance", () => {
    expect(
      resolvePromotionCloseAt({
        performanceDate: "2026-09-24",
        closeAt: "",
        today,
      })
    ).toBe("");
  });
});
