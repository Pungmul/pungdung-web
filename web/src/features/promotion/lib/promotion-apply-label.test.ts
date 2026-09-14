import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { resolvePromotionApplyLabel } from "./promotion-apply-label";

describe("resolvePromotionApplyLabel", () => {
  it("treats CLOSED status as closed before closeAt", () => {
    const label = resolvePromotionApplyLabel({
      status: "CLOSED",
      closeAt: "2026-09-25T00:00:00",
      now: dayjs("2026-09-23T06:00:00"),
    });
    expect(label).toEqual({
      kind: "closed",
      label: "이미 마감된 공연이에요",
    });
  });

  it("treats a passed closeAt as closed while status is OPEN", () => {
    const label = resolvePromotionApplyLabel({
      status: "OPEN",
      closeAt: "2026-09-23T05:00:00",
      now: dayjs("2026-09-23T06:00:00"),
    });
    expect(label.kind).toBe("closed");
  });

  it("uses calendar D-N when at least 24 hours remain", () => {
    const label = resolvePromotionApplyLabel({
      status: "OPEN",
      closeAt: "2026-09-25T00:00:00",
      now: dayjs("2026-09-23T06:00:00"),
    });
    expect(label).toEqual({ kind: "dday", label: "D-2, 신청하기" });
  });

  it("uses a countdown inside 24 hours", () => {
    const label = resolvePromotionApplyLabel({
      status: "OPEN",
      closeAt: "2026-09-24T00:00:00",
      now: dayjs("2026-09-23T06:00:00"),
    });
    expect(label).toEqual({ kind: "countdown", label: "18:00:00 신청하기" });
  });

  it("keeps D-N when exactly 24 hours remain", () => {
    const label = resolvePromotionApplyLabel({
      status: "OPEN",
      closeAt: "2026-09-24T00:00:00",
      now: dayjs("2026-09-23T00:00:00"),
    });
    expect(label).toEqual({ kind: "dday", label: "D-1, 신청하기" });
  });
});
