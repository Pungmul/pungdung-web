import { expect, test } from "@playwright/test";

import {
  E2E_NOTIFICATION_TITLE,
  E2E_PREVIOUS_NOTIFICATION_TITLE,
} from "../fixtures/notification/responses";
import { mockNotificationHttp } from "../helpers/notification-route-mocks";

test("NOTI-001 | 알림 목록을 조회하고 대상 화면으로 이동한다", async ({
  page,
}) => {
  await mockNotificationHttp(page);

  await test.step("안 읽은 알림과 이전 알림이 보임", async () => {
    await page.goto("/notification", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText(E2E_NOTIFICATION_TITLE, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(E2E_PREVIOUS_NOTIFICATION_TITLE, { exact: true })
    ).toBeVisible();
  });

  await test.step("알림을 누르면 연결된 화면으로 이동함", async () => {
    await page.getByText(E2E_NOTIFICATION_TITLE, { exact: true }).click();
    await expect(page).toHaveURL(/\/board\/d\/45/);
  });
});
