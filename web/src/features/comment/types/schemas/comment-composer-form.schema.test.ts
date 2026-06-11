import { describe, expect, it } from "vitest";

import { commentComposerFormSchema } from "./comment-composer-form.schema";

describe("commentComposerFormSchema", () => {
  it("내용을 trim해서 통과시킨다", () => {
    const parsed = commentComposerFormSchema.safeParse({
      content: "  댓글입니다.  ",
      anonymity: true,
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.content).toBe("댓글입니다.");
    }
  });

  it("공백만 있는 내용은 실패한다", () => {
    const parsed = commentComposerFormSchema.safeParse({
      content: "   ",
      anonymity: true,
    });

    expect(parsed.success).toBe(false);
  });
});
