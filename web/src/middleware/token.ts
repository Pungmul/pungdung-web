import { enqueueCookieMutation } from "./cookie";
import type { MiddlewareContext } from "./types";

import { refreshAuthToken } from "@/features/auth/api/server";

const secureCookie = process.env.NODE_ENV === "production";

/** 인증 쿠키(access/refresh)를 삭제하도록 작업을 등록합니다. */
export const clearAuthCookies = (ctx: MiddlewareContext): void => {
  enqueueCookieMutation(ctx, { type: "delete", name: "accessToken" });
  enqueueCookieMutation(ctx, { type: "delete", name: "refreshToken" });
};

/** 재발급 결과를 인증 쿠키로 반영하도록 작업을 등록합니다. */
export const applyAuthCookies = (
  ctx: MiddlewareContext,
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
  refreshTokenExpiresIn: number
): void => {
  enqueueCookieMutation(ctx, {
    type: "set",
    name: "accessToken",
    value: accessToken,
    options: {
      httpOnly: true,
      secure: secureCookie,
      maxAge: expiresIn,
    },
  });
  enqueueCookieMutation(ctx, {
    type: "set",
    name: "refreshToken",
    value: refreshToken,
    options: {
      httpOnly: true,
      secure: secureCookie,
      maxAge: refreshTokenExpiresIn,
    },
  });
};

/** refreshToken 기반 access/refresh 재발급을 시도합니다. */
export const tryReissueToken = async (
  ctx: MiddlewareContext
): Promise<boolean> => {
  try {
    const reissued = await refreshAuthToken();
    applyAuthCookies(
      ctx,
      reissued.accessToken,
      reissued.expiresIn,
      reissued.refreshToken,
      reissued.refreshTokenExpiresIn
    );
    ctx.tokens.accessToken = reissued.accessToken;
    ctx.tokens.refreshToken = reissued.refreshToken;
    return true;
  } catch (error) {
    console.error(error);
    clearAuthCookies(ctx);
    delete ctx.tokens.accessToken;
    delete ctx.tokens.refreshToken;
    return false;
  }
};
