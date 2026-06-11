/**
 * `account.schema` — 이메일 형식/비밀번호 규칙/확인 일치의 순수 스키마 검증.
 */
import { describe, expect, it } from "vitest";

import { accountSchema } from "./account.schema";

describe("accountSchema", () => {
  const validAccount = {
    email: "newuser@example.com",
    password: "abcd1234!",
    confirmPassword: "abcd1234!",
  };

  it("이메일·비밀번호 규칙을 만족하면 통과한다", async () => {
    const r = await accountSchema.safeParseAsync(validAccount);
    expect(r.success).toBe(true);
  });

  it("비밀번호와 확인이 다르면 confirmPassword 경로에 오류가 난다", async () => {
    const r = await accountSchema.safeParseAsync({
      ...validAccount,
      confirmPassword: "other1234!",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "confirmPassword")).toBe(
        true
      );
    }
  });

  it("비밀번호가 규칙에 맞지 않으면 password 필드에서 실패한다", async () => {
    const r = await accountSchema.safeParseAsync({
      email: "x@y.co",
      password: "short!",
      confirmPassword: "short!",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "password")).toBe(true);
    }
  });
});
