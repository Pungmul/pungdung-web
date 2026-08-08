import type { CriticalFlow, ReportAppErrorContext } from "./report-app-error.types";

const SIGNUP_PATHS = new Set(["/api/auth/sign-up", "/api/auth/kakao/sign-up"]);

// 크리티컬 4xx는 POST만
// 이메일 체크 GET, 로그인, 설문 submit 제외
export function getCriticalFlow(
  ctx: ReportAppErrorContext
): CriticalFlow | undefined {
  if ((ctx.method ?? "GET").toUpperCase() !== "POST") {
    return undefined;
  }
  const pathname = getPathname(ctx.endpoint);
  if (!pathname) {
    return undefined;
  }
  if (SIGNUP_PATHS.has(pathname)) {
    return "signup";
  }
  if (pathname === "/api/promotions/create") {
    return "promotion_publish";
  }
  if (/^\/api\/promotions\/forms\/[^/]+\/(uploadImage|save)$/.test(pathname)) {
    return "promotion_publish";
  }
  return undefined;
}

function getPathname(endpoint: string | undefined): string | undefined {
  if (!endpoint) {
    return undefined;
  }
  const path = endpoint.split("?")[0];
  if (!path) {
    return undefined;
  }
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return new URL(path).pathname;
    }
  } catch {
    return path;
  }
  return path;
}
