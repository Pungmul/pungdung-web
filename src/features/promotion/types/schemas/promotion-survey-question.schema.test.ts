import { describe, expect, it } from "vitest";

import {
  createPromotionSurveyFormValuesSchema,
  parsePromotionQuestionSettingsJson,
  promotionSurveyQuestionSchema,
} from "./promotion-survey-question.schema";

const base = {
  id: 1,
  label: "Q1",
  required: true,
  orderNo: 1,
  settingsJson: "{}",
};

describe("promotionSurveyQuestionSchema", () => {
  it("TEXT: applies defaults when settingsJson empty", () => {
    const parsed = promotionSurveyQuestionSchema.safeParse({
      ...base,
      questionType: "TEXT",
      options: [],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.questionType === "TEXT") {
      expect(parsed.data.settings.maxLength).toBe(100);
      expect(parsed.data.settings.placeholder).toBe("답변을 입력해주세요.");
    }
  });

  it("TEXT: reads maxLength and placeholder from settingsJson", () => {
    const parsed = promotionSurveyQuestionSchema.safeParse({
      ...base,
      questionType: "TEXT",
      options: [],
      settingsJson: JSON.stringify({
        maxLength: 50,
        placeholder: "입력",
      }),
    });
    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.questionType === "TEXT") {
      expect(parsed.data.settings.maxLength).toBe(50);
      expect(parsed.data.settings.placeholder).toBe("입력");
    }
  });

  it("CHOICE: rejects when options empty", () => {
    const parsed = promotionSurveyQuestionSchema.safeParse({
      ...base,
      questionType: "CHOICE",
      options: [],
    });
    expect(parsed.success).toBe(false);
  });

  it("CHOICE: accepts with options", () => {
    const parsed = promotionSurveyQuestionSchema.safeParse({
      ...base,
      questionType: "CHOICE",
      options: [{ id: 10, label: "A", orderNo: 1 }],
    });
    expect(parsed.success).toBe(true);
  });

  it("CHECKBOX: clamps min/max within option count", () => {
    const parsed = promotionSurveyQuestionSchema.safeParse({
      ...base,
      questionType: "CHECKBOX",
      options: [
        { id: 1, label: "a", orderNo: 1 },
        { id: 2, label: "b", orderNo: 2 },
      ],
      settingsJson: JSON.stringify({ min: 0, max: 99 }),
    });
    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.questionType === "CHECKBOX") {
      expect(parsed.data.settings.min).toBe(1);
      expect(parsed.data.settings.max).toBe(2);
    }
  });
});

describe("createPromotionSurveyFormValuesSchema", () => {
  const questions = [
    promotionSurveyQuestionSchema.parse({
      ...base,
      id: 1,
      questionType: "TEXT",
      required: true,
      options: [],
    }),
    promotionSurveyQuestionSchema.parse({
      ...base,
      id: 2,
      questionType: "CHOICE",
      required: true,
      options: [{ id: 10, label: "A", orderNo: 1 }],
    }),
    promotionSurveyQuestionSchema.parse({
      ...base,
      id: 3,
      questionType: "CHECKBOX",
      required: true,
      options: [
        { id: 20, label: "a", orderNo: 1 },
        { id: 21, label: "b", orderNo: 2 },
      ],
      settingsJson: "{}",
    }),
  ] as const;

  const schema = createPromotionSurveyFormValuesSchema([...questions]);

  it("fails when required TEXT is empty", () => {
    const result = schema.safeParse({
      answers: {
        "1": { answerText: "  ", selectedOptionIds: [] },
        "2": { answerText: null, selectedOptionIds: [10] },
        "3": { answerText: null, selectedOptionIds: [20, 21] },
      },
    });
    expect(result.success).toBe(false);
  });

  it("passes when all required fields filled", () => {
    const result = schema.safeParse({
      answers: {
        "1": { answerText: "ok", selectedOptionIds: [] },
        "2": { answerText: null, selectedOptionIds: [10] },
        "3": { answerText: null, selectedOptionIds: [20, 21] },
      },
    });
    expect(result.success).toBe(true);
  });

  it("fails CHECKBOX when below min selections", () => {
    const checkboxMin2 = promotionSurveyQuestionSchema.parse({
      ...base,
      id: 3,
      questionType: "CHECKBOX",
      required: true,
      options: [
        { id: 20, label: "a", orderNo: 1 },
        { id: 21, label: "b", orderNo: 2 },
      ],
      settingsJson: JSON.stringify({ min: 2, max: 2 }),
    });
    const schemaMin2 = createPromotionSurveyFormValuesSchema([
      promotionSurveyQuestionSchema.parse({
        ...base,
        id: 1,
        questionType: "TEXT",
        required: true,
        options: [],
      }),
      promotionSurveyQuestionSchema.parse({
        ...base,
        id: 2,
        questionType: "CHOICE",
        required: true,
        options: [{ id: 10, label: "A", orderNo: 1 }],
      }),
      checkboxMin2,
    ]);
    const result = schemaMin2.safeParse({
      answers: {
        "1": { answerText: "ok", selectedOptionIds: [] },
        "2": { answerText: null, selectedOptionIds: [10] },
        "3": { answerText: null, selectedOptionIds: [20] },
      },
    });
    expect(result.success).toBe(false);
  });

  it("optional TEXT: empty is valid", () => {
    const optionalText = promotionSurveyQuestionSchema.parse({
      ...base,
      id: 99,
      questionType: "TEXT",
      required: false,
      options: [],
    });
    const s = createPromotionSurveyFormValuesSchema([optionalText]);
    const result = s.safeParse({
      answers: {
        "99": { answerText: "", selectedOptionIds: [] },
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("parsePromotionQuestionSettingsJson", () => {
  it("returns {} for empty or whitespace", () => {
    expect(parsePromotionQuestionSettingsJson("")).toEqual({});
    expect(parsePromotionQuestionSettingsJson("   ")).toEqual({});
  });

  it("returns {} for invalid JSON", () => {
    expect(parsePromotionQuestionSettingsJson("{")).toEqual({});
  });

  it("returns {} for non-object JSON", () => {
    expect(parsePromotionQuestionSettingsJson("[]")).toEqual({});
    expect(parsePromotionQuestionSettingsJson('"x"')).toEqual({});
  });

  it("returns object for valid JSON object", () => {
    expect(parsePromotionQuestionSettingsJson('{"a":1}')).toEqual({ a: 1 });
  });
});
