/**
 * `terms.schema` — 서비스·개인정보 약관 동의 refine.
 */
import { describe, expect, it } from "vitest";

import { termsAgreementSchema } from "./terms.schema";

function assertFieldError(
  path: PropertyKey[],
  partialMessage?: string
): (issues: readonly { path: readonly PropertyKey[]; message: string }[]) => void {
  return (issues) => {
    const hit = issues.find(
      (i) =>
        i.path.length === path.length &&
        path.every((p, idx) => i.path[idx] === p)
    );
    expect(hit, `expected issue at path ${String(path.join("."))}`).toBeDefined();
    if (partialMessage) {
      expect(hit!.message).toContain(partialMessage);
    }
  };
}

describe("termsAgreementSchema", () => {
  it("두 약관이 모두 true일 때만 통과한다", () => {
    expect(
      termsAgreementSchema.safeParse({
        usingTermAgree: true,
        personalInfoAgree: true,
      }).success
    ).toBe(true);
  });

  it("하나라도 false이면 실패한다", () => {
    const r = termsAgreementSchema.safeParse({
      usingTermAgree: true,
      personalInfoAgree: false,
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      assertFieldError(["usingTermAgree"], "약관")(r.error.issues);
    }
  });
});
