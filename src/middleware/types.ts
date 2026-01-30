import type { NextRequest, NextResponse } from "next/server";

/**
 * 인증 상태 판단에 사용하는 핵심 토큰 묶음입니다.
 * `signUpToken`은 가입 플로우 전용이므로 별도 필드로 분리합니다.
 */
export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

/** 미들웨어 실행 중 공유되는 요청 컨텍스트입니다. */
export type MiddlewareContext = {
  req: NextRequest;
  pathname: string;
  requestCookies: NextRequest["cookies"];
  tokens: AuthTokens;
  signUpToken?: string;
  cookieMutations: CookieMutation[];
};

/** 응답 직전에 반영할 쿠키 변경 작업입니다. */
export type CookieMutation =
  | {
      type: "set";
      name: string;
      value: string;
      options?: {
        httpOnly?: boolean;
        secure?: boolean;
        maxAge?: number;
      };
    }
  | {
      type: "delete";
      name: string;
    };

/** 단일 미들웨어 단계의 표준 핸들러 타입입니다. */
export type MiddlewareHandler = (
  ctx: MiddlewareContext,
) => Promise<NextResponse | null> | NextResponse | null;
