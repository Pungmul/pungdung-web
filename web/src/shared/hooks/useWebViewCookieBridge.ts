"use client";
import { useEffect } from "react";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const WEBVIEW_COOKIE_ISSUED_MESSAGE = "Cookie issued";
const WEBVIEW_COOKIE_ISSUE_FAILED_MESSAGE = "Cookie didn't issue";

function isReactNativeWebViewUserAgent() {
  if (typeof window === "undefined") {
    return false;
  }

  return /React-Native/i.test(window.navigator.userAgent);
}

function parseAuthTokens(rawData: unknown): AuthTokens | null {
  if (typeof rawData !== "string") {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawData);
  } catch {
    return null;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("accessToken" in parsed) ||
    !("refreshToken" in parsed)
  ) {
    return null;
  }

  const { accessToken, refreshToken } = parsed;

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return null;
  }

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

function postMessageToWebView(message: string) {
  if (typeof window === "undefined" || !window.ReactNativeWebView) {
    return;
  }

  window.ReactNativeWebView.postMessage(JSON.stringify(message));
}

export function useWebViewCookieBridge() {
  useEffect(() => {
    const issueToken = async (tokens: AuthTokens) => {
      try {
        const response = await fetch("/api/auth/cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokens),
        });

        if (!response.ok) {
          throw Error("Failed to issue cookies");
        }

        postMessageToWebView(WEBVIEW_COOKIE_ISSUED_MESSAGE);
      } catch {
        postMessageToWebView(WEBVIEW_COOKIE_ISSUE_FAILED_MESSAGE);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!isReactNativeWebViewUserAgent()) {
        return;
      }

      const tokens = parseAuthTokens(event.data);
      if (!tokens) {
        return;
      }

      issueToken(tokens);
    };

    document.addEventListener("message", handleMessage as EventListener);
    window.addEventListener("message", handleMessage);

    return () => {
      document.removeEventListener("message", handleMessage as EventListener);
      window.removeEventListener("message", handleMessage);
    };
  }, []);
}
