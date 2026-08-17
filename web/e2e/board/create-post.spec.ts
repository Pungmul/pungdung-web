import { expect, test } from "@playwright/test";

import { mockBoardHttp } from "../helpers/board-route-mocks";

test("BOARD-015 | 게시 실패 후 입력 유지하고 재시도한다", async ({ page }) => {
  test.setTimeout(90_000);
  await mockBoardHttp(page, { createFailsOnce: true });

  await test.step("글쓰기에서 제목과 본문을 채움", async () => {
    await page.goto("/board/p?boardId=1");
    await page.getByPlaceholder("제목을 입력하세요").fill("재시도 제목");
    await page.locator('[contenteditable="true"]').click();
    await page.locator('[contenteditable="true"]').pressSequentially("재시도 본문");
  });

  await test.step("첫 저장은 실패하고 입력값은 남음", async () => {
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("게시물 작성에 실패했습니다.");
      await dialog.accept();
    });
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await expect(page).toHaveURL(/\/board\/p\?boardId=1/);
    await expect(page.getByPlaceholder("제목을 입력하세요")).toHaveValue(
      "재시도 제목"
    );
    await expect(page.getByText("재시도 본문", { exact: true })).toBeVisible();
  });

  await test.step("다시 저장하면 생성 상세로 이동", async () => {
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await expect(page).toHaveURL(/\/board\/d\/777/, { timeout: 45_000 });
    await expect(page.getByText("재시도 제목", { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("재시도 본문", { exact: true })).toBeVisible();
  });
});

test("BOARD-004 | 새 글을 게시하면 상세에 내용이 보인다", async ({ page }) => {
  test.setTimeout(90_000);
  await mockBoardHttp(page);

  await test.step("제목과 본문을 쓰고 저장", async () => {
    await page.goto("/board/p?boardId=1");
    await page.getByPlaceholder("제목을 입력하세요").fill("신규 게시 제목");
    await page.locator('[contenteditable="true"]').click();
    await page.locator('[contenteditable="true"]').pressSequentially("신규 게시 본문");
    await page.getByRole("button", { name: "저장", exact: true }).click();
  });

  await test.step("생성 상세에서 작성 내용이 보임", async () => {
    await expect(page).toHaveURL(/\/board\/d\/777/, { timeout: 45_000 });
    await expect(page.getByText("신규 게시 제목", { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("신규 게시 본문", { exact: true })).toBeVisible();
  });
});
