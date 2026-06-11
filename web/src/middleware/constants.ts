/** 미들웨어 검사를 생략할 경로 prefix 목록입니다. */
export const BYPASS_PATH_PREFIXES = [
  "/icons",
  "/logos",
  "/fonts",
  "/terms",
  "/manifest.webmanifest",
  "/dedicated-worker.js",
  "/pungdung-sw.js",
  "/pungdung-fcm-background.js",
  "/socket-worker.js",
  "/api/auth/kakao/callback",
  "/kakao/callback",
] as const;

/** 로그인 상태일 때 우회/리다이렉트 대상 인증 페이지 prefix 목록입니다. */
export const AUTH_PAGE_PREFIXES = [
  "/login",
  "/sign-up",
  "/api/auth/cookie",
  "/api/auth/kakao/login",
] as const;

/** 비로그인 상태에서도 접근 가능한 공개 페이지 prefix 목록입니다. */
export const PUBLIC_PAGE_PREFIXES = [
  "/login",
  "/sign-up",
  "/cookie",
  "/kakao/login",
  "/reset-password",
] as const;
