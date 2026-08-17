import { expect, test } from "@playwright/test";

import { mockBoardHttp } from "../helpers/board-route-mocks";
import { mockLightningHttp } from "../helpers/route-mocks";
import { failEnvelope } from "../fixtures/envelope";
import { hotPostListResponse } from "../fixtures/board/responses";

test("HOME-002 | 인기글만 실패해도 나머지 홈은 유지된다", async ({ page }) => {
  let hotPostFailRemaining = 1;

  await mockLightningHttp(page, {
    nearby: "list",
    withMeetings: true,
  });
  await mockBoardHttp(page, { skipAppShell: true });
  await page.route("**/api/boards/hot-post**", async (route) => {
    if (hotPostFailRemaining > 0) {
      hotPostFailRemaining -= 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("인기글을 불러오지 못했습니다.")),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(hotPostListResponse),
    });
  });

  await test.step("인기글만 오류이고 근처 번개는 그대로 보임", async () => {
    await page.goto("/home");
    await expect(
      page.getByRole("paragraph").filter({
        hasText: "인기글을 불러오지 못했습니다.",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "다시 시도", exact: true })
    ).toBeVisible();
    await expect(page.getByText("E2E 테스트 번개", { exact: true })).toBeVisible();
    await expect(
      page.getByText("번개 더 찾아보기", { exact: true })
    ).toBeVisible();
  });

  await test.step("다시 시도하면 인기글이 복구됨", async () => {
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "E2E 게시글 제목" })
    ).toBeVisible();
    await expect(
      page.getByText("인기글을 불러오지 못했습니다.", { exact: true })
    ).toHaveCount(0);
  });
});
