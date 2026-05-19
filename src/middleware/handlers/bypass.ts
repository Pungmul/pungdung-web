import { NextResponse } from "next/server";

import { BYPASS_PATH_PREFIXES } from "../constants";

import { matchesPrefix } from "../path";
import type { MiddlewareHandler } from "../types";

/** 정적 리소스/예외 경로를 즉시 통과시킵니다. */
export const bypassHandler: MiddlewareHandler = (ctx) => {
  if (matchesPrefix(ctx.pathname, BYPASS_PATH_PREFIXES)) {
    return NextResponse.next();
  }

  return null;
};
