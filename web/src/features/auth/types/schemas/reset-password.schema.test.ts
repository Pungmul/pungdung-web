/**
 * 비밀번호 재설정 플로우 관련 스키마 테스트.
 *
 * - `emailCheckSchema`: 재설정 메일 발송 전 단계에서 이메일 문자열만 검증한다.
 * - `resetPasswordSchema`: 새 비밀번호 길이·허용 특수문자 집합·확인 필드 일치(refine)를 검증한다.
 */
import { describe, expect, it } from "vitest";

import { emailCheckSchema, resetPasswordSchema } from "./reset-password.schema";

describe("emailCheckSchema", () => {
  it("유효한 이메일이면 통과한다", () => {
    expect(emailCheckSchema.safeParse({ email: "a@b.co" }).success).toBe(true);
  });

  it("형식에 맞지 않으면 email 필드에서 실패한다", () => {
    const r = emailCheckSchema.safeParse({ email: "invalid" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "email")).toBe(true);
    }
  });
});

describe("resetPasswordSchema", () => {
  /** 길이·문자 클래스·confirm 일치를 한 번에 통과하는 기준 비밀번호 쌍. */
  const valid = {
    password: "abcd1234!",
    confirmPassword: "abcd1234!",
  };

  it("규칙에 맞는 비밀번호·일치하면 통과한다", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("비밀번호 길이가 짧으면 실패한다", () => {
    const r = resetPasswordSchema.safeParse({
      password: "short1!",
      confirmPassword: "short1!",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "password")).toBe(true);
    }
  });

  it("허용되지 않은 특수문자가 있으면 실패한다", () => {
    const r = resetPasswordSchema.safeParse({
      password: "abcd1234?",
      confirmPassword: "abcd1234?",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "password")).toBe(true);
    }
  });

  it("비밀번호 확인이 다르면 confirmPassword 경로에 오류가 난다", () => {
    const r = resetPasswordSchema.safeParse({
      password: "abcd1234!",
      confirmPassword: "abcd1234@",
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
