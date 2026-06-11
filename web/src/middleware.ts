import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createMiddlewareContext } from "./middleware/context";
import { applyCookieMutations } from "./middleware/cookie";
import { middlewarePipeline } from "./middleware/pipeline";

/** 요청을 파이프라인 형태로 처리하는 미들웨어 엔트리입니다. */
export async function middleware(req: NextRequest) {
  const ctx = createMiddlewareContext(req);

  for (const handler of middlewarePipeline) {
    const response = await handler(ctx);
    if (response) {
      return applyCookieMutations(response, ctx);
    }
  }

  return applyCookieMutations(NextResponse.next(), ctx);
}

/** 미들웨어 적용 경로 설정입니다. */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - notification (notification API routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|notification).*)",
  ],
};
