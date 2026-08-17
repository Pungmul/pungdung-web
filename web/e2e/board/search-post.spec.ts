import { expect, test } from "@playwright/test";

import {
  E2E_POST_TITLE,
  E2E_SEARCH_KEYWORD,
} from "../fixtures/board/responses";
import { mockBoardHttp } from "../helpers/board-route-mocks";

test("BOARD-033 | 게시판에서 검색하고 상세로 연결한다", async ({ page }) => {
  test.setTimeout(90_000);
  await mockBoardHttp(page);

  await test.step("게시판 목록과 글이 보인다", async () => {
    await page.goto("/board/1");
    await expect(
      page.getByRole("heading", { name: E2E_POST_TITLE })
    ).toBeVisible();
  });

  await test.step("검색 결과에서 같은 글을 고르면 상세로 이동", async () => {
    await page.getByRole("button", { name: "검색", exact: true }).click();
    await page.getByRole("textbox", { name: "검색", exact: true }).fill(
      E2E_SEARCH_KEYWORD
    );
    await page.getByRole("button", { name: "검색 실행", exact: true }).click();
    await expect(page).toHaveURL(/\/board\/1\/search\?keyword=/, {
      timeout: 45_000,
    });
    await expect(
      page.getByRole("heading", { name: E2E_POST_TITLE })
    ).toBeVisible();
    await page
      .locator("a", {
        has: page.getByRole("heading", { name: E2E_POST_TITLE }),
      })
      .click();
    await expect(page).toHaveURL(/\/board\/d\/501/, { timeout: 45_000 });
    await expect(page.getByText(E2E_POST_TITLE, { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("E2E 게시글 본문입니다.", { exact: true })).toBeVisible();
  });
});
