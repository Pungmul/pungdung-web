import { expect, test } from "@playwright/test";

import { E2E_POST_ID, E2E_POST_TITLE } from "../fixtures/board/responses";
import { E2E_NOTIFICATION_TITLE } from "../fixtures/notification/responses";
import { mockBoardHttp } from "../helpers/board-route-mocks";
import { mockNotificationHttp } from "../helpers/notification-route-mocks";
import { mockLightningHttp } from "../helpers/route-mocks";

// 서비스 워커가 창 없이 여는 콜드 스타트 URL
// /board/main은 RSC에서 실서버를 호출하므로 page.route로 막을 수 있는 부모 경로 사용
const coldStartUrl = `/board/d/${E2E_POST_ID}?__sw_navigation=${encodeURIComponent(
  JSON.stringify(["/home", "/notification"])
)}`;

test("NOTI-COLD-001 | 알림으로 콜드 스타트한 뒤 뒤로가기로 부모 화면을 거친다", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await mockLightningHttp(page, { nearby: "list", withMeetings: true });
  await mockBoardHttp(page, { skipAppShell: true });
  await mockNotificationHttp(page, { skipAppShell: true });

  await test.step("알림 목적지 상세가 진입 표시 없는 URL로 보임", async () => {
    await page.goto(coldStartUrl);
    await expect(page).toHaveURL(new RegExp(`/board/d/${E2E_POST_ID}$`));
    await expect(
      page.getByText("E2E 게시글 본문입니다.", { exact: true })
    ).toBeVisible({ timeout: 20_000 });
  });

  await test.step("뒤로가기는 알림 목록 화면을 보여줌", async () => {
    await page.goBack();
    await expect(page).toHaveURL(/\/notification$/);
    await expect(
      page.getByText(E2E_NOTIFICATION_TITLE, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("E2E 게시글 본문입니다.", { exact: true })
    ).toBeHidden();
  });

  await test.step("한 번 더 뒤로가기는 홈 화면을 보여줌", async () => {
    await page.goBack();
    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByRole("heading", { name: "E2E User님 안녕하세요?" })
    ).toBeVisible();
  });

  await test.step("앞으로가기로 목적지 상세에 다시 도착함", async () => {
    await page.goForward();
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`/board/d/${E2E_POST_ID}$`));
    await expect(page.getByText(E2E_POST_TITLE, { exact: true })).toBeVisible();
    await expect(
      page.getByText("E2E 게시글 본문입니다.", { exact: true })
    ).toBeVisible();
  });
});
