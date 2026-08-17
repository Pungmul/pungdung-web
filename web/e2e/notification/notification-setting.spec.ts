import { expect, test } from "@playwright/test";

import { mockNotificationHttp } from "../helpers/notification-route-mocks";

test("NOTI-005 | 알림 권한을 거부해도 목록 화면은 유지된다", async ({
  page,
  context,
}) => {
  await context.clearPermissions();
  await mockNotificationHttp(page);

  await page.goto("/my-page/notification-setting");
  await expect(page.getByText("알림 설정을 변경할 수 있어요.")).toBeVisible();
  await expect(page.getByRole("switch", { name: "알림 설정" })).toHaveAttribute(
    "aria-checked",
    "false"
  );

  await page.goto("/notification");
  await expect(page.getByText("읽지 않은 알림", { exact: true })).toBeVisible();
});

test("NOTI-006 | 토큰 등록 실패 화면은 FCM 토큰 발급에 의존한다", async () => {
  test.skip(
    true,
    "requestFCMToken/getToken이 E2E에서 끝나지 않아 토글 클릭을 두지 않는다"
  );
});

test("NOTI-007 | 토글 실패 오표시는 FCM 토큰 발급에 의존한다", async () => {
  test.skip(
    true,
    "requestFCMToken/getToken이 E2E에서 끝나지 않아 토글 클릭을 두지 않는다"
  );
});
