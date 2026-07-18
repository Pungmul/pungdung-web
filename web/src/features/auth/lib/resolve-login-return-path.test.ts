import { describe, expect, it } from "vitest";

import { resolveLoginReturnPath } from "./resolve-login-return-path";

describe("resolveLoginReturnPath", () => {
  it("내부 경로만 로그인 복귀 경로로 허용한다", () => {
    expect(resolveLoginReturnPath("/board/1")).toBe("/board/1");
    expect(resolveLoginReturnPath("//evil.example.com")).toBe("/home");
    expect(resolveLoginReturnPath("/\\evil.example.com")).toBe("/home");
    expect(resolveLoginReturnPath("https://evil.example.com")).toBe("/home");
  });
});
