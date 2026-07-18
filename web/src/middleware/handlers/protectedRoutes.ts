import { NextResponse } from "next/server";

import { isAccessTokenExpired } from "../is-access-token-expired";
import { getGuestRoutePolicy, toInternalNext } from "../route-policy";
import { clearAuthCookies, tryReissueToken } from "../token";
import type { MiddlewareContext, MiddlewareHandler } from "../types";

const withoutAuthCookies = (cookieHeader: string | null): string | null => {
  if (!cookieHeader) return null;

  const remainingCookies = cookieHeader
    .split(";")
    .filter((cookie) => {
      const name = cookie.trim().split("=", 1)[0];
      return name !== "accessToken" && name !== "refreshToken";
    })
    .join(";");

  return remainingCookies || null;
};

const nextAsGuest = (ctx: MiddlewareContext) => {
  const headers = new Headers(ctx.req.headers);
  const cookieHeader = withoutAuthCookies(headers.get("cookie"));
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  } else {
    headers.delete("cookie");
  }
  return NextResponse.next({ request: { headers } });
};

/** 보호 페이지 접근 시 토큰 상태를 검사하고 필요 시 재발급합니다. */
export const protectedRoutesHandler: MiddlewareHandler = async (ctx) => {
  const hasAccessToken = Boolean(
    ctx.tokens.accessToken && !isAccessTokenExpired(ctx.tokens.accessToken)
  );
  const hasRefreshToken = Boolean(ctx.tokens.refreshToken);
  const policy = getGuestRoutePolicy(ctx.pathname, ctx.req.nextUrl.search);
  const loginUrl = (reason: "auth_required" | "session_expired") => {
    const url = new URL("/login", ctx.req.url);
    url.searchParams.set(
      "next",
      toInternalNext(ctx.pathname, ctx.req.nextUrl.search)
    );
    url.searchParams.set("reason", reason);
    return url;
  };

  if (!hasAccessToken && !hasRefreshToken) {
    if (policy !== "member-only") {
      clearAuthCookies(ctx);
      return nextAsGuest(ctx);
    }

    clearAuthCookies(ctx);
    return NextResponse.redirect(loginUrl("auth_required"));
  }

  if (!hasAccessToken && hasRefreshToken) {
    const reissued = await tryReissueToken(ctx);
    if (!reissued) {
      if (policy === "public") {
        return nextAsGuest(ctx);
      }
      return NextResponse.redirect(loginUrl("session_expired"));
    }
  }

  return null;
};
