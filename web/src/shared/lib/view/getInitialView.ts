import { ViewType } from "@/shared/types";

import { isWebViewUserAgent } from "./isWebViewUserAgent";
import { resolveCookieView } from "./viewCookie";

export const getInitialView = (): ViewType => {
  if (typeof window !== "undefined") {
    const cookieView = resolveCookieView();
    if (cookieView) {
      return cookieView;
    }

    if (isWebViewUserAgent(navigator.userAgent)) {
      return "webview";
    }

    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    return isMobileViewport ? "mobile" : "desktop";
  }

  return "desktop";
};
