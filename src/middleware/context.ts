import type { NextRequest } from "next/server";

import type { AuthTokens, MiddlewareContext } from "./types";

/**
 * 가입 플로우 쿠키 키 변경/혼용에 대응하기 위한 안전 조회 함수입니다.
 */
const resolveSignUpToken = (req: NextRequest): string | undefined =>
  req.cookies.get("signUpToken")?.value ??
  req.cookies.get("kakaoSignUpToken")?.value;

/**
 * exactOptionalPropertyTypes 환경에서 undefined 속성을 넣지 않도록
 * 존재하는 토큰만 객체에 포함합니다.
 */
const resolveAuthTokens = (req: NextRequest): AuthTokens => {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  return {
    ...(accessToken ? { accessToken } : {}),
    ...(refreshToken ? { refreshToken } : {}),
  };
};

/** 요청 객체에서 미들웨어 공통 컨텍스트를 생성합니다. */
export const createMiddlewareContext = (req: NextRequest): MiddlewareContext => {
  const signUpToken = resolveSignUpToken(req);

  return {
    req,
    pathname: req.nextUrl.pathname,
    requestCookies: req.cookies,
    tokens: resolveAuthTokens(req),
    ...(signUpToken ? { signUpToken } : {}),
    cookieMutations: [],
  };
};
