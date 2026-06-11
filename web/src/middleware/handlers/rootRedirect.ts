import { NextResponse } from "next/server";

import { clearAuthCookies } from "../token";
import type { MiddlewareHandler } from "../types";

/** 루트 경로(`/`) 접근을 로그인 상태에 따라 분기합니다. */
export const rootRedirectHandler: MiddlewareHandler = (ctx) => {
  if (ctx.pathname !== "/") {
    return null;
  }

  if (ctx.tokens.refreshToken) {
    return NextResponse.redirect(new URL("/home", ctx.req.url));
  }

  clearAuthCookies(ctx);
  return NextResponse.redirect(new URL("/login", ctx.req.url));
};
