import { expect, test } from "@playwright/test";

import { E2E_NOTIFICATION_TITLE } from "../fixtures/notification/responses";
import { mockNotificationHttp } from "../helpers/notification-route-mocks";

test("NOTI-001 | 알림 목록을 조회하고 읽음 처리한다", async ({ page }) => {
  await mockNotificationHttp(page);

  await test.step("목록에서 알림 제목이 보임", async () => {
    await page.goto("/notification", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("읽지 않은 알림", { exact: true })).toBeVisible();
    await expect(
      page.getByText(E2E_NOTIFICATION_TITLE, { exact: true })
    ).toBeVisible();
  });

  await test.step("알림을 누르면 읽음 처리되어 빈 안내가 보임", async () => {
    await page.getByText(E2E_NOTIFICATION_TITLE, { exact: true }).click();
    await expect(
      page.getByText("알림이 없습니다.", { exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/notification/);
  });
});

test("NOTI | 알림 딥링크 이동", async () => {
  test.skip(
    true,
    "알림 클릭은 읽음 API만 호출하고 다른 화면으로 이동하지 않는다"
  );
});
