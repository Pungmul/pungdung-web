import { describe, expect, it } from "vitest";

import { normalizePromotionSurveyQuestions } from "./normalize-promotion-survey-questions";

describe("normalizePromotionSurveyQuestions", () => {
  it("returns ok for valid published questions", () => {
    const result = normalizePromotionSurveyQuestions([
      {
        id: 1,
        questionType: "TEXT",
        label: "T",
        required: false,
        orderNo: 1,
        settingsJson: "{}",
        options: [],
      },
      {
        id: 2,
        questionType: "CHOICE",
        label: "C",
        required: false,
        orderNo: 2,
        settingsJson: "{}",
        options: [{ id: 1, label: "a", orderNo: 1 }],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
    }
  });

  it("returns not ok when CHOICE has no options", () => {
    const result = normalizePromotionSurveyQuestions([
      {
        id: 1,
        questionType: "CHOICE",
        label: "C",
        required: false,
        orderNo: 1,
        settingsJson: "{}",
        options: [],
      },
    ]);
    expect(result.ok).toBe(false);
  });
});
