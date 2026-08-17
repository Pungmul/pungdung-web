import { expect, test } from "@playwright/test";

import { seedExpiredAuthCookies } from "../helpers/auth";
import { mockAppShellHttp } from "../helpers/route-mocks";

test.use({ storageState: { cookies: [], origins: [] } });

test("COMMON-006 | 보호 화면에서 세션이 만료되면 재로그인 안내", async ({
  page,
  context,
}) => {
  await seedExpiredAuthCookies(context);
  await mockAppShellHttp(page);

  await test.step("만료된 세션으로 홈에 들어가면 로그인 안내가 보임", async () => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText("로그인 세션이 만료되었습니다. 다시 로그인해주세요.", {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByText("로그인 후 이용해주세요.", { exact: true })
    ).toBeVisible();
  });

  await test.step("확인하면 비인증 로그인 화면이 남음", async () => {
    await page.getByRole("button", { name: "확인", exact: true }).click();
    await expect(page).toHaveURL(/\/login/);
    const cookieNames = (await context.cookies()).map(({ name }) => name);
    expect(cookieNames).not.toContain("accessToken");
    expect(cookieNames).not.toContain("refreshToken");
  });
});
