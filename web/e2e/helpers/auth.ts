import type { BrowserContext, Page } from "@playwright/test";

// hasValidAccessToken은 payload 파싱 실패 시 만료로 보지 않음 → JWT 형태 불필요
export const E2E_ACCESS_TOKEN =
  "FAKE_E2E_HEADER.FAKE_E2E_PAYLOAD.FAKE_E2E_SIGNATURE";
const E2E_REFRESH_TOKEN = "FAKE_E2E_REFRESH_TOKEN";

// induction 라우트·세션 게이트용 가짜 인증 쿠키
export async function seedAuthCookies(context: BrowserContext): Promise<void> {
  await context.addCookies([
    {
      name: "accessToken",
      value: E2E_ACCESS_TOKEN,
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
    },
    {
      name: "refreshToken",
      value: E2E_REFRESH_TOKEN,
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
}

export async function ensureAuthCookies(page: Page): Promise<void> {
  await seedAuthCookies(page.context());
}
