import { describe, expect, it } from "vitest";

import { buildDraftQuestion } from "./build-question-draft";

describe("buildDraftQuestion", () => {
  it("creates TEXT question with empty options", () => {
    const q = buildDraftQuestion("TEXT", 2);
    expect(q.questionType).toBe("TEXT");
    expect(q.orderNo).toBe(2);
    expect(q.options).toEqual([]);
  });

  it("creates CHOICE question with one empty option", () => {
    const q = buildDraftQuestion("CHOICE", 1);
    expect(q.questionType).toBe("CHOICE");
    expect(q.options).toHaveLength(1);
    expect(q.options[0]?.label).toBe("");
  });
});
