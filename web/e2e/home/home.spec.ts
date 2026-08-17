import { expect, test } from "@playwright/test";

import { mockBoardHttp } from "../helpers/board-route-mocks";
import { mockLightningHttp } from "../helpers/route-mocks";

async function seedFrequentBoard(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "frequentBoardList",
      JSON.stringify({
        state: { boardList: [{ id: 1, name: "자유게시판" }] },
        version: 0,
      })
    );
  });
}

test("HOME-001 | 홈 주요 영역과 주변 번개가 보인다", async ({ page }) => {
  test.setTimeout(90_000);
  await seedFrequentBoard(page);
  await mockLightningHttp(page, {
    nearby: "list",
    withMeetings: true,
  });
  await mockBoardHttp(page, { skipAppShell: true });

  await test.step("홈 헤더와 자주 가는 게시판, 인기글, 근처 번개가 표시됨", async () => {
    await page.goto("/home");
    await expect(
      page.getByRole("heading", { name: "E2E User님 안녕하세요?" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "자주 가는 게시판", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "자유게시판" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "지금 뜨는 인기글" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "E2E 게시글 제목" })).toBeVisible();
    await expect(page.getByText("E2E 테스트 번개", { exact: true })).toBeVisible();
    await expect(
      page.getByText("번개 더 찾아보기", { exact: true })
    ).toBeVisible();
  });

  await test.step("인기글 카드로 게시글 상세에 들어감", async () => {
    await page
      .locator("a", {
        has: page.getByRole("heading", { name: "E2E 게시글 제목" }),
      })
      .click();
    await expect(page).toHaveURL(/\/board\/d\/501/, { timeout: 45_000 });
    await expect(
      page.getByText("E2E 게시글 제목", { exact: true })
    ).toBeVisible({ timeout: 20_000 });
  });
});
