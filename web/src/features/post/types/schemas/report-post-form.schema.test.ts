import { describe, expect, it } from "vitest";

import { reportPostModalFormSchema } from "./report-post-form.schema";

describe("reportPostModalFormSchema", () => {
  it("사유 미선택이면 실패한다", () => {
    expect(reportPostModalFormSchema.safeParse({}).success).toBe(false);
  });

  it("유효한 사유 키면 성공한다", () => {
    const parsed = reportPostModalFormSchema.safeParse({
      reportReason: "SPAM",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.reportReason).toBe("SPAM");
    }
  });
});
