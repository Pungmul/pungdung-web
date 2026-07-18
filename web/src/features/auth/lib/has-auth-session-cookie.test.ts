import { describe, expect, it } from "vitest";

import { hasAuthSessionCookie } from "./has-auth-session-cookie";

describe("hasAuthSessionCookie", () => {
  it.each([
    [false, undefined, undefined],
    [true, "access-token", undefined],
    [true, undefined, "refresh-token"],
  ])("returns %s when access=%s and refresh=%s", (expected, access, refresh) => {
    expect(hasAuthSessionCookie(access, refresh)).toBe(expected);
  });
});
