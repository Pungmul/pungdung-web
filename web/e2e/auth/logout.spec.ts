import { expect, test } from "@playwright/test";

import { mockAppShellHttp } from "../helpers/route-mocks";

test("AUTH-007 | 로그아웃 - 정상 로그아웃 및 보호 화면 차단", async ({
  page,
  context,
}) => {
  await mockAppShellHttp(page);

  await test.step("로그아웃하면 로그인 화면으로 이동하고 세션이 사라짐", async () => {
    await page.goto("/logout");
    await expect(page).toHaveURL(/\/login$/);

    const cookieNames = (await context.cookies()).map(({ name }) => name);
    expect(cookieNames).not.toContain("accessToken");
    expect(cookieNames).not.toContain("refreshToken");
  });

  await test.step("보호 화면은 로그인 유도만 보여줌", async () => {
    await page.goto("/my-page");
    await expect(page).toHaveURL(/\/my-page$/);
    await expect(
      page.getByRole("heading", { name: "로그인 후 이용할 수 있어요" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "카카오로 시작하기" })
    ).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/my-page$/);
    await expect(
      page.getByRole("heading", { name: "로그인 후 이용할 수 있어요" })
    ).toBeVisible();
  });
});
