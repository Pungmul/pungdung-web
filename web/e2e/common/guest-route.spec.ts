import { expect, test } from "@playwright/test";

import { E2E_PROMOTION_TITLE } from "../fixtures/promotion/responses";
import { mockAppShellHttp } from "../helpers/route-mocks";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test.describe("게스트 라우트", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("COMMON-001 | 게스트도 공개 공연 목록에 들어간다", async ({ page }) => {
    await mockPromotionHttp(page);
    await page.goto("/board/promote/l?tab=promotion-list");
    await expect(page).toHaveURL(/\/board\/promote\/l/);
    await expect(
      page.getByRole("link", { name: new RegExp(E2E_PROMOTION_TITLE) })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "로그인 후 이용할 수 있어요" })
    ).toHaveCount(0);
  });

  test("COMMON-002 | 게스트 홈은 리다이렉트 없이 로그인 유도를 보여준다", async ({
    page,
  }) => {
    await mockAppShellHttp(page);
    await page.goto("/home");
    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByRole("heading", { name: "로그인 후 이용할 수 있어요" })
    ).toBeVisible();
  });

  test("COMMON-003 | 회원 전용 글쓰기 화면은 로그인으로 보낸다", async ({
    page,
  }) => {
    await mockAppShellHttp(page);
    await page.goto("/board/p?boardId=1");
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/reason=auth_required/);
    await expect(
      page.getByText("로그인 후 이용할 수 있는 페이지입니다.", { exact: true })
    ).toBeVisible();
  });

  test("COMMON-008 | 중간 액션에서 로그인 확인창을 보여준다", async ({
    page,
  }) => {
    await mockPromotionHttp(page);
    await page.goto("/board/promote/d/e2e-promotion");
    await page.getByRole("button", { name: "참가 신청하기", exact: true }).click();
    await expect(page.getByText("로그인 필요", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "로그인하기", exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/board\/promote\/d\/e2e-promotion/);
  });
});
