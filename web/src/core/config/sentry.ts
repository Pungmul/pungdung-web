import type { ErrorEvent, EventHint } from "@sentry/nextjs";
import * as Sentry from "@sentry/nextjs";

// ClientApiError extra 키. 요청 JSON, 세션 쿠키, 토큰이 이슈로 나가면 가입/채팅 바디 유출
const SENSITIVE_EXTRA_KEYS = new Set([
  "payload",
  "cookie",
  "cookies",
  "authorization",
  "accesstoken",
  "refreshtoken",
]);

function getSentryDsn(): string | undefined {
  // 브라우저는 NEXT_PUBLIC_*만 번들에 포함. 서버는 비공개 DSN 우선
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SENTRY_DSN;
  }

  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
}

function getSentryEnvironment(): string {
  if (process.env.VERCEL_ENV === "preview") {
    return "preview";
  }

  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return "production";
  }

  return "development";
}

function isSentryEnabled(): boolean {
  if (!getSentryDsn()) {
    return false;
  }

  // Playwright 플래그. E2E 실패로 실프로젝트 오염 방지
  if (process.env.NEXT_PUBLIC_E2E === "1") {
    return false;
  }

  if (process.env.NODE_ENV === "test") {
    return false;
  }

  // Preview는 NODE_ENV=production. 실서비스 이슈와 분리
  if (process.env.VERCEL_ENV === "preview") {
    return false;
  }

  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "name" in error && error.name === "AbortError";
}

function isOfflineNetworkError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const status = "status" in error ? error.status : undefined;
  const code = "code" in error ? error.code : undefined;

  // fetch 실패를 ClientApiError(status 0, NETWORK_ERROR)로 감싼 경우. 기기 오프라인/탭 이동이지 서버 장애 아님
  return status === 0 || code === "NETWORK_ERROR";
}

function omitSensitiveExtra(
  extra: Record<string, unknown>
): Record<string, unknown> {
  const next: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(extra)) {
    if (SENSITIVE_EXTRA_KEYS.has(key.toLowerCase())) {
      continue;
    }

    next[key] = value;
  }

  return next;
}

function scrubSentryEvent(
  event: ErrorEvent,
  hint: EventHint
): ErrorEvent | null {
  const original = hint.originalException;

  // 요청 취소나 네트워크 단절 이벤트는 이슈에서 제외
  if (isAbortError(original) || isOfflineNetworkError(original)) {
    return null;
  }

  if (event.extra) {
    event.extra = omitSensitiveExtra(event.extra);
  }

  const headers = event.request?.headers;
  if (headers) {
    const nextHeaders = { ...headers };
    delete nextHeaders.cookie;
    delete nextHeaders.Cookie;
    delete nextHeaders.authorization;
    delete nextHeaders.Authorization;
    event.request = { ...event.request, headers: nextHeaders };
  }

  return event;
}

export function initSentry(): void {
  Sentry.init({
    dsn: getSentryDsn(),
    enabled: isSentryEnabled(),
    environment: getSentryEnvironment(),
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    sampleRate: 1,
    // tracing 비활성. 에러 ingest만
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubSentryEvent,
  });
}
