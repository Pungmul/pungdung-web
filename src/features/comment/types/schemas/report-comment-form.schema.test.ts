import { describe, expect, it } from "vitest";

import { reportCommentFormSchema } from "./report-comment-form.schema";

describe("reportCommentFormSchema", () => {
  it("지원하는 신고 사유만 통과시킨다", () => {
    expect(
      reportCommentFormSchema.safeParse({ reportReason: "SPAM" }).success
    ).toBe(true);
    expect(
      reportCommentFormSchema.safeParse({ reportReason: "UNKNOWN" }).success
    ).toBe(false);
  });
});
