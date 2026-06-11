import { NextResponse } from "next/server";

import type { MiddlewareHandler } from "../types";

/** 카카오 가입 완료 토큰 유무를 검사해 접근을 제어합니다. */
export const kakaoSignUpHandler: MiddlewareHandler = (ctx) => {
  if (!ctx.pathname.startsWith("/kakao/sign-up")) {
    return null;
  }

  if (ctx.signUpToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", ctx.req.url));
};
