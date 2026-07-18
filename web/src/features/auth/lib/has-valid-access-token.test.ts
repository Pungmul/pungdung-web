import { describe, expect, it } from "vitest";

import { hasValidAccessToken } from "./has-valid-access-token";

function createToken(exp: number): string {
  return `header.${btoa(JSON.stringify({ exp }))}.signature`;
}

describe("hasValidAccessToken", () => {
  it("만료된 access token은 로그인 상태로 판단하지 않는다", () => {
    const expiredToken = createToken(Math.floor(Date.now() / 1000) - 1);

    expect(hasValidAccessToken(expiredToken)).toBe(false);
  });

  it("유효한 access token은 로그인 상태로 판단한다", () => {
    const validToken = createToken(Math.floor(Date.now() / 1000) + 60);

    expect(hasValidAccessToken(validToken)).toBe(true);
  });
});
