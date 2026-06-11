import { authPagesHandler } from "./handlers/authPages";
import { bypassHandler } from "./handlers/bypass";
import { kakaoSignUpHandler } from "./handlers/kakaoSignUp";
import { protectedRoutesHandler } from "./handlers/protectedRoutes";
import { rootRedirectHandler } from "./handlers/rootRedirect";
import { viewTypeCookieHandler } from "./handlers/view-type-cookie";
import type { MiddlewareHandler } from "./types";

/** 요청당 순서대로 실행되는 미들웨어 파이프라인입니다. */
export const middlewarePipeline: MiddlewareHandler[] = [
  bypassHandler,
  viewTypeCookieHandler,
  kakaoSignUpHandler,
  rootRedirectHandler,
  authPagesHandler,
  protectedRoutesHandler,
];
