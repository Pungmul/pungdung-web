import type { NextResponse } from "next/server";

import type { CookieMutation, MiddlewareContext } from "./types";

/** 실행 중 생성된 쿠키 변경 작업을 큐에 적재합니다. */
export const enqueueCookieMutation = (
  ctx: MiddlewareContext,
  mutation: CookieMutation
): void => {
  ctx.cookieMutations.push(mutation);
};

const DEFAULT_SET_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
};

/** 누적된 쿠키 변경 작업을 최종 응답에 반영합니다. */
export const applyCookieMutations = (
  response: NextResponse,
  ctx: MiddlewareContext
): NextResponse => {
  for (const mutation of ctx.cookieMutations) {
    if (mutation.type === "set") {
      response.cookies.set(mutation.name, mutation.value, {
        ...DEFAULT_SET_COOKIE_OPTIONS,
        ...mutation.options,
      });
      continue;
    }
    response.cookies.delete(mutation.name);
  }

  return response;
};
