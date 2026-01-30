import type { MiddlewareHandler } from "./types";
import { bypassHandler } from "./handlers/bypass";
import { kakaoSignUpHandler } from "./handlers/kakaoSignUp";
import { rootRedirectHandler } from "./handlers/rootRedirect";
import { authPagesHandler } from "./handlers/authPages";
import { protectedRoutesHandler } from "./handlers/protectedRoutes";

/** 요청당 순서대로 실행되는 미들웨어 파이프라인입니다. */
export const middlewarePipeline: MiddlewareHandler[] = [
  bypassHandler,
  kakaoSignUpHandler,
  rootRedirectHandler,
  authPagesHandler,
  protectedRoutesHandler,
];
