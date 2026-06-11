import { describe, expect, it } from "vitest";

import { questionOptionSchema } from "./question-option.schema";

describe("questionOptionSchema", () => {
  it("accepts non-empty label and non-negative orderNo", () => {
    const r = questionOptionSchema.safeParse({ label: "A", orderNo: 0 });
    expect(r.success).toBe(true);
  });

  it("rejects empty label after trim", () => {
    const r = questionOptionSchema.safeParse({ label: "   ", orderNo: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects negative orderNo", () => {
    const r = questionOptionSchema.safeParse({ label: "A", orderNo: -1 });
    expect(r.success).toBe(false);
  });
});
