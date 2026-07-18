import { describe, expect, it, vi } from "vitest";

import { isAccessTokenExpired } from "./is-access-token-expired";

const createToken = (payload: object) =>
  `header.${btoa(JSON.stringify(payload)).replace(/=/g, "")}.signature`;

describe("isAccessTokenExpired", () => {
  it("JWT exp가 과거면 만료로 판단한다", () => {
    vi.spyOn(Date, "now").mockReturnValue(2_000_000);

    expect(isAccessTokenExpired(createToken({ exp: 1_000 }))).toBe(true);

    vi.restoreAllMocks();
  });

  it("JWT가 아니거나 exp가 없으면 기존 인증 흐름을 유지한다", () => {
    expect(isAccessTokenExpired("opaque-token")).toBe(false);
    expect(isAccessTokenExpired(createToken({}))).toBe(false);
  });
});
