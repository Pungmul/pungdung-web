import { describe, expect, it } from "vitest";

import { buildPromotionSavePayload } from "./build-promotion-save-payload";
import type { PromotionPostingFormValues } from "../types/promotion-posting-form.types";

function baseValues(
  overrides: Partial<PromotionPostingFormValues> = {}
): PromotionPostingFormValues {
  return {
    title: "공연",
    address: null,
    date: "2027-06-01",
    time: "19:30",
    closeAt: "2027-05-25T00:00:00",
    limitPersonnel: 10,
    isUnlimitedPersonnel: false,
    poster: null,
    questions: [],
    descriptionSeed: "",
    ...overrides,
  };
}

describe("buildPromotionSavePayload", () => {
  it("maps date/time to ISO snapshot.startAt", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues(),
      expectedVersion: 3,
      descriptionMarkdown: "## 본문",
    });
    expect(payload.expectedVersion).toBe(3);
    expect(payload.snapshot.startAt).toBe("2027-06-01T19:30:00");
    expect(payload.snapshot.closeAt).toBe("2027-05-25T00:00:00");
    expect(payload.snapshot.description).toBe("## 본문");
    expect(payload.snapshot.formType).toBe("PERFORMANCE");
  });

  it("uses null limit when unlimited personnel", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues({
        isUnlimitedPersonnel: true,
        limitPersonnel: 99,
      }),
      expectedVersion: 1,
      descriptionMarkdown: "",
    });
    expect(payload.snapshot.limitNum).toBeNull();
  });

  it("includes poster id list when poster present", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues({
        poster: { id: 42, imageUrl: "https://x" },
      }),
      expectedVersion: 0,
      descriptionMarkdown: "x",
    });
    expect(payload.snapshot.performanceImageIdList).toEqual([42]);
  });

  it("defaults closeAt to a week before the performance date at midnight", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues({ closeAt: "" }),
      expectedVersion: 0,
      descriptionMarkdown: "",
    });
    expect(payload.snapshot.closeAt).toBe("2027-05-25T00:00:00");
  });

  it("sets closeAt null when performance date is empty", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues({ date: "", closeAt: "" }),
      expectedVersion: 0,
      descriptionMarkdown: "",
    });
    expect(payload.snapshot.closeAt).toBeNull();
  });

  it("sets performanceImageIdList null when no poster", () => {
    const payload = buildPromotionSavePayload({
      values: baseValues({ poster: null }),
      expectedVersion: 0,
      descriptionMarkdown: "",
    });
    expect(payload.snapshot.performanceImageIdList).toBeNull();
  });
});
