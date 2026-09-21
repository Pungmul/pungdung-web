import { describe, expect, it } from "vitest";

import {
  PENDING_INVITATION_COOKIE,
  PENDING_INVITATION_MAX_AGE,
} from "../pending-invitation";

import type { MiddlewareContext } from "../types";
import { inviteCodeHandler } from "./invite-code";

function createContext(url: string): MiddlewareContext {
  const nextUrl = new URL(url);

  return {
    req: {
      url,
      nextUrl,
    },
    pathname: nextUrl.pathname,
    requestCookies: {} as MiddlewareContext["requestCookies"],
    tokens: {},
    cookieMutations: [],
  } as unknown as MiddlewareContext;
}

describe("inviteCodeHandler", () => {
  it("6자리 초대코드를 쿠키에 심고 /home 으로 보냄", () => {
    const ctx = createContext("http://localhost:3000/invite?inviteCode=123456");

    const response = inviteCodeHandler(ctx);

    expect(response).toBeInstanceOf(Response);
    if (response instanceof Promise || response === null) {
      throw new Error("동기 리다이렉트 응답이어야 함");
    }
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("http://localhost:3000/home");
    expect(ctx.cookieMutations).toEqual([
      {
        type: "set",
        name: PENDING_INVITATION_COOKIE,
        value: "123456",
        options: {
          httpOnly: true,
          maxAge: PENDING_INVITATION_MAX_AGE,
          path: "/",
          sameSite: "lax",
          secure: false,
        },
      },
    ]);
  });

  it("형식이 아니면 쿠키 없이 /home 으로 보냄", () => {
    const ctx = createContext("http://localhost:3000/invite?inviteCode=12");

    const response = inviteCodeHandler(ctx);

    if (response instanceof Promise || response === null) {
      throw new Error("동기 리다이렉트 응답이어야 함");
    }
    expect(response.headers.get("location")).toBe("http://localhost:3000/home");
    expect(ctx.cookieMutations).toEqual([]);
  });

  it("/invite 가 아니면 통과함", () => {
    const ctx = createContext("http://localhost:3000/home?inviteCode=123456");

    expect(inviteCodeHandler(ctx)).toBeNull();
    expect(ctx.cookieMutations).toEqual([]);
  });
});
