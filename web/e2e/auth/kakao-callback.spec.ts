import { expect, type Page, test } from "@playwright/test";

import { E2E_ACCESS_TOKEN } from "../helpers/auth";
import { mockAppShellHttp } from "../helpers/route-mocks";

const E2E_REFRESH_TOKEN = "FAKE_E2E_REFRESH_TOKEN";
const E2E_SIGN_UP_TOKEN = "FAKE_E2E_KAKAO_SIGN_UP_TOKEN";

test.use({ storageState: { cookies: [], origins: [] } });

async function cookieNames(page: Page): Promise<string[]> {
  return (await page.context().cookies()).map(({ name }) => name);
}

test("AUTH-009 | 카카오 callback 미가입 - 가입 분기 화면", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await mockAppShellHttp(page);

  await test.step("미가입 callback이면 카카오 가입 약관 화면으로 이동", async () => {
    const callback = new URL("http://127.0.0.1:3100/kakao/callback");
    callback.searchParams.set("need_register", "true");
    callback.searchParams.set("sign_up_token", E2E_SIGN_UP_TOKEN);

    await page.goto(callback.href);
    // callback Location이 localhost면 127.0.0.1 쿠키가 안 따라감
    // 가입 게이트는 쿠키를 심은 호스트에서 염
    await page.goto("http://127.0.0.1:3100/kakao/sign-up");

    await expect(page).toHaveURL(/\/kakao\/sign-up$/);
    await expect(page.getByText("회원가입", { exact: true })).toBeVisible();
    await expect(page.getByText("약관동의", { exact: true })).toBeVisible();
    await expect(
      page.getByText("모든 약관에 동의합니다", { exact: true })
    ).toBeVisible();
    await expect(page).not.toHaveURL(/\/home/);

    const names = await cookieNames(page);
    expect(names).toContain("signUpToken");
    expect(names).not.toContain("accessToken");
    expect(names).not.toContain("refreshToken");
  });
});

test("AUTH-008 | 카카오 callback 기존 회원 - 세션과 목적 경로", async ({
  page,
  context,
}) => {
  test.setTimeout(90_000);
  await mockAppShellHttp(page);

  await test.step("기존 회원 callback이면 홈과 세션 쿠키", async () => {
    const callback = new URL("/kakao/callback", "http://127.0.0.1:3100");
    callback.searchParams.set("token", E2E_ACCESS_TOKEN);
    callback.searchParams.set("refresh_token", E2E_REFRESH_TOKEN);
    callback.searchParams.set("redirectURL", "/home");

    await page.goto(`${callback.pathname}${callback.search}`);

    await expect(page).toHaveURL(/\/home$/);
    await expect
      .poll(async () => (await context.cookies()).map(({ name }) => name).sort())
      .toEqual(expect.arrayContaining(["accessToken", "refreshToken"]));
    expect((await context.cookies()).map(({ name }) => name)).not.toContain(
      "signUpToken"
    );
  });
});
