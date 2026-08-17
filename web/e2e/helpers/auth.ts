import type { BrowserContext, Page } from "@playwright/test";

const E2E_TOKEN_USERNAME = "e2e-user";
export const E2E_REFRESH_TOKEN = "FAKE_E2E_REFRESH_TOKEN";

function encodeJwtSegment(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function makeAccessToken(expUnixSeconds: number): string {
  return [
    encodeJwtSegment({ alg: "none", typ: "JWT" }),
    encodeJwtSegment({
      username: E2E_TOKEN_USERNAME,
      sub: E2E_TOKEN_USERNAME,
      exp: expUnixSeconds,
    }),
    "e2e-sig",
  ].join(".");
}

// 미들웨어 만료 판정과 채팅 username 디코드가 payload를 읽음
export const E2E_ACCESS_TOKEN = makeAccessToken(
  Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
);

export const E2E_EXPIRED_ACCESS_TOKEN = makeAccessToken(1);

async function addAuthCookies(
  context: BrowserContext,
  accessToken: string
): Promise<void> {
  await context.addCookies([
    {
      name: "accessToken",
      value: accessToken,
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

// induction 라우트·세션 게이트용 테스트 인증 쿠키
export async function seedAuthCookies(context: BrowserContext): Promise<void> {
  await addAuthCookies(context, E2E_ACCESS_TOKEN);
}

export async function seedExpiredAuthCookies(
  context: BrowserContext
): Promise<void> {
  await addAuthCookies(context, E2E_EXPIRED_ACCESS_TOKEN);
}

export async function ensureAuthCookies(page: Page): Promise<void> {
  await seedAuthCookies(page.context());
}
