import { ViewType } from "@/shared/types";
import { isWebViewUserAgent } from "./isWebViewUserAgent";

export const resolveRuntimeView = (): ViewType => {
  if (
    typeof navigator !== "undefined" &&
    isWebViewUserAgent(navigator.userAgent)
  ) {
    return "webview";
  }

  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
};
