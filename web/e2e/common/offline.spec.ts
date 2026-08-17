import { expect, test } from "../fixtures/test";

import { mockAppShellHttp } from "../helpers/route-mocks";

test("COMMON-007 | 오프라인에서도 화면이 유지되고 복구된다", async ({
  page,
  context,
}) => {
  await mockAppShellHttp(page);
  await page.goto("/home");
  await expect(page).toHaveURL(/\/home/);

  await test.step("오프라인 안내가 보이고 페이지는 유지됨", async () => {
    await context.setOffline(true);
    await expect(
      page.getByText("인터넷 연결이 끊겼습니다", { exact: true })
    ).toBeVisible();
    await expect(page).not.toHaveURL("about:blank");
  });

  await test.step("온라인 복구 후 안내가 사라짐", async () => {
    await context.setOffline(false);
    await expect(
      page.getByText("인터넷 연결이 끊겼습니다", { exact: true })
    ).toHaveCount(0);
  });
});

test("COMMON-007 | standalone에서는 오프라인 재시도 버튼이 보인다", async ({
  page,
  context,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "pwa",
    "pwa 프로젝트의 standalone display-mode에서만 검증한다"
  );
  await mockAppShellHttp(page);
  await page.goto("/home");
  await context.setOffline(true);
  await expect(
    page.getByText("인터넷 연결이 끊겼습니다", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "다시 시도", exact: true })
  ).toBeVisible();
});
