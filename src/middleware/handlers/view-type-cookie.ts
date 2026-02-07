import { VIEW_TYPE_COOKIE_NAME } from "@/shared/lib/view/constants";

import { enqueueCookieMutation } from "../cookie";
import type { MiddlewareHandler } from "../types";

const VIEW_TYPE_MAX_AGE = 60 * 60 * 24 * 365;

const resolveViewTypeFromUserAgent = (
  userAgent: string
): "webview" | "mobile" | "desktop" => {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (
    normalizedUserAgent.includes("react-native") ||
    normalizedUserAgent.includes("wv") ||
    normalizedUserAgent.includes("webview")
  ) {
    return "webview";
  }

  if (
    normalizedUserAgent.includes("mobile") ||
    normalizedUserAgent.includes("android") ||
    normalizedUserAgent.includes("iphone") ||
    normalizedUserAgent.includes("ipod") ||
    normalizedUserAgent.includes("ipad") ||
    normalizedUserAgent.includes("tablet")
  ) {
    return "mobile";
  }

  return "desktop";
};

/** 최초 요청에 view-type 쿠키를 세팅해 SSR 초기 뷰를 고정합니다. */
export const viewTypeCookieHandler: MiddlewareHandler = (ctx) => {
  const userAgent = ctx.req.headers.get("user-agent") ?? "";
  const resolvedViewType = resolveViewTypeFromUserAgent(userAgent);
  const currentViewType = ctx.requestCookies.get(VIEW_TYPE_COOKIE_NAME)?.value;

  if (currentViewType === resolvedViewType) {
    return null;
  }

  enqueueCookieMutation(ctx, {
    type: "set",
    name: VIEW_TYPE_COOKIE_NAME,
    value: resolvedViewType,
    options: {
      maxAge: VIEW_TYPE_MAX_AGE,
    },
  });

  return null;
};
