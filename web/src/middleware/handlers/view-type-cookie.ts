import { VIEW_TYPE_COOKIE_NAME } from "@/shared/lib/view/constants";
import { isViewType } from "@/shared/lib/view/isViewType";

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
  const currentViewType = ctx.requestCookies.get(VIEW_TYPE_COOKIE_NAME)?.value;

  if (currentViewType && isViewType(currentViewType)) {
    return null;
  }

  // 쿠키가 없거나 잘못된 값일 때만 UA 기반으로 최초 세팅
  const userAgent = ctx.req.headers.get("user-agent") ?? "";
  const resolvedViewType = resolveViewTypeFromUserAgent(userAgent);

  enqueueCookieMutation(ctx, {
    type: "set",
    name: VIEW_TYPE_COOKIE_NAME,
    value: resolvedViewType,
    options: {
      maxAge: VIEW_TYPE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    },
  });

  return null;
};
