/**
 * 비밀번호 변경 폼 스키마 테스트.
 *
 * - 각 문자열 필드는 최소 길이 등 객체 수준 검증이 있고,
 * - `newPassword`와 `confirmPassword` 일치는 스키마 루트 `refine`으로 처리되어
 *   불일치 시 `path: ["confirmPassword"]` 쪽에 메시지가 붙는 패턴을 검증한다.
 */
import { describe, expect, it } from "vitest";

import { changePasswordSchema } from "./change-password.schema";

describe("changePasswordSchema", () => {
  /** 통과 기준이 되는 세 필드 조합(현재·새·확인이 동일한 패턴으로 맞춤). */
  const base = {
    currentPassword: "old12345",
    newPassword: "new12345",
    confirmPassword: "new12345",
  };

  it("세 필드가 채워지고 새 비밀번호가 일치하면 통과한다", () => {
    expect(changePasswordSchema.safeParse(base).success).toBe(true);
  });

  it("현재 비밀번호가 비어 있으면 실패한다", () => {
    const r = changePasswordSchema.safeParse({
      ...base,
      currentPassword: "",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "currentPassword")).toBe(
        true
      );
    }
  });

  it("새 비밀번호와 확인이 다르면 confirmPassword 경로에 refine 오류가 난다", () => {
    const r = changePasswordSchema.safeParse({
      ...base,
      confirmPassword: "other12345",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const confirmIssues = r.error.issues.filter(
        (i) => i.path[0] === "confirmPassword"
      );
      expect(confirmIssues.some((i) => i.message.includes("일치"))).toBe(true);
    }
  });
});
