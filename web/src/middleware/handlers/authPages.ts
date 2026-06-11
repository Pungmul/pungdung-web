import { NextResponse } from "next/server";

import { AUTH_PAGE_PREFIXES } from "../constants";

import { matchesPrefix } from "../path";
import { tryReissueToken } from "../token";
import type { MiddlewareHandler } from "../types";

/** 인증 페이지 접근 시 로그인 상태를 점검해 리다이렉트합니다. */
export const authPagesHandler: MiddlewareHandler = async (ctx) => {
  if (!matchesPrefix(ctx.pathname, AUTH_PAGE_PREFIXES)) {
    return null;
  }

  if (ctx.tokens.accessToken) {
    return NextResponse.redirect(new URL("/home", ctx.req.url));
  }

  if (!ctx.tokens.refreshToken) {
    return NextResponse.next();
  }

  const reissued = await tryReissueToken(ctx);
  if (reissued) {
    return NextResponse.redirect(new URL("/home", ctx.req.url));
  }

  return NextResponse.next();
};
