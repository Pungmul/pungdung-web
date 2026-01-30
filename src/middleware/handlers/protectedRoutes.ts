import { NextResponse } from "next/server";
import { PUBLIC_PAGE_PREFIXES } from "../constants";
import { matchesPrefix } from "../path";
import { clearAuthCookies, tryReissueToken } from "../token";
import type { MiddlewareHandler } from "../types";

/** 보호 페이지 접근 시 토큰 상태를 검사하고 필요 시 재발급합니다. */
export const protectedRoutesHandler: MiddlewareHandler = async (ctx) => {
  const hasAccessToken = Boolean(ctx.tokens.accessToken);
  const hasRefreshToken = Boolean(ctx.tokens.refreshToken);

  if (!hasAccessToken && !hasRefreshToken) {
    if (matchesPrefix(ctx.pathname, PUBLIC_PAGE_PREFIXES)) {
      return NextResponse.next();
    }

    clearAuthCookies(ctx);
    return NextResponse.redirect(new URL("/login", ctx.req.url));
  }

  if (!hasAccessToken && hasRefreshToken) {
    const reissued = await tryReissueToken(ctx);
    if (!reissued) {
      return NextResponse.redirect(new URL("/login", ctx.req.url));
    }
  }

  return null;
};
