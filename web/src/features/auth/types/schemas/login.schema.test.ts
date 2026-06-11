/**
 * 로그인 폼용 `loginSchema` 검증.
 *
 * - `loginId`: 이메일 형식(Zod의 email 규칙)을 만족해야 한다.
 * - `password`: 길이 8~12자 제한(상한·하한 모두 스키마에서 검사)을 검증한다.
 *
 * 실패 시 어떤 필드에서 이슈가 나는지 `path[0]`로 거칠게 필터링해,
 * UI에서 필드별 에러를 매핑할 때와 동일한 관점으로 테스트한다.
 */
import { describe, expect, it } from "vitest";

import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
  it("올바른 이메일·비밀번호 길이면 통과한다", () => {
    const r = loginSchema.safeParse({
      loginId: "user@example.com",
      password: "abcd1234",
    });
    expect(r.success).toBe(true);
  });

  it("이메일 형식이 아니면 실패한다", () => {
    const r = loginSchema.safeParse({
      loginId: "not-an-email",
      password: "abcd1234",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const loginIssues = r.error.issues.filter((i) => i.path[0] === "loginId");
      expect(loginIssues.length).toBeGreaterThan(0);
    }
  });

  it("비밀번호가 8자 미만이면 실패한다", () => {
    const r = loginSchema.safeParse({
      loginId: "user@example.com",
      password: "short1",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const pwIssues = r.error.issues.filter((i) => i.path[0] === "password");
      expect(pwIssues.length).toBeGreaterThan(0);
    }
  });

  it("비밀번호가 12자 초과이면 실패한다", () => {
    const r = loginSchema.safeParse({
      loginId: "user@example.com",
      password: "1234567890123",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const pwIssues = r.error.issues.filter((i) => i.path[0] === "password");
      expect(pwIssues.length).toBeGreaterThan(0);
    }
  });
});
