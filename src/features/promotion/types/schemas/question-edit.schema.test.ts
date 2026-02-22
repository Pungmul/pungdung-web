import { describe, expect, it } from "vitest";

import {
  getQuestionItemEditSchema,
  questionItemEditSchema,
} from "./question-edit.schema";

describe("questionItemEditSchema", () => {
  it("TEXT: allows empty options array", () => {
    const r = questionItemEditSchema.safeParse({
      questionType: "TEXT",
      label: "질문",
      required: false,
      options: [],
    });
    expect(r.success).toBe(true);
  });

  it("CHOICE: requires at least one option", () => {
    const ok = questionItemEditSchema.safeParse({
      questionType: "CHOICE",
      label: "질문",
      required: true,
      options: [{ label: "1", orderNo: 0 }],
    });
    expect(ok.success).toBe(true);

    const bad = questionItemEditSchema.safeParse({
      questionType: "CHOICE",
      label: "질문",
      required: true,
      options: [],
    });
    expect(bad.success).toBe(false);
  });

  it("TEXT: rejects more than zero options", () => {
    const r = questionItemEditSchema.safeParse({
      questionType: "TEXT",
      label: "질문",
      required: false,
      options: [{ label: "x", orderNo: 0 }],
    });
    expect(r.success).toBe(false);
  });
});

describe("getQuestionItemEditSchema", () => {
  it("returns branch schema for TEXT", () => {
    const s = getQuestionItemEditSchema("TEXT");
    const r = s.safeParse({
      questionType: "TEXT",
      label: "T",
      required: false,
      options: [],
    });
    expect(r.success).toBe(true);
  });

  it("returns branch schema for CHECKBOX with options", () => {
    const s = getQuestionItemEditSchema("CHECKBOX");
    const r = s.safeParse({
      questionType: "CHECKBOX",
      label: "C",
      required: false,
      options: [{ label: "a", orderNo: 0 }],
    });
    expect(r.success).toBe(true);
  });
});
