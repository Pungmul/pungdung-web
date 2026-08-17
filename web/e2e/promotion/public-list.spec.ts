import { expect, test } from "@playwright/test";

import { E2E_PROMOTION_TITLE } from "../fixtures/promotion/responses";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO-001 | 공개 공연 목록과 빈 상태를 구분한다", async ({ page }) => {
  await mockPromotionHttp(page);

  await test.step("목록에서 공연 제목이 보임", async () => {
    await page.goto("/board/promote/l?tab=promotion-list");
    await expect(page.getByRole("tab", { name: "공연 목록" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: new RegExp(E2E_PROMOTION_TITLE) })
    ).toBeVisible();
  });
});

test("PROMO-001 | 모집 중인 공연이 없으면 빈 안내를 보여준다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { emptyList: true });

  await page.goto("/board/promote/l?tab=promotion-list");
  await expect(
    page.getByText("현재 모집중인 공연이 없어요.", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "새로운 공연 등록하기", exact: true })
  ).toBeVisible();
});

test("PROMO-002 | 공연 상세에서 신청으로 들어간다", async ({ page }) => {
  await mockPromotionHttp(page);

  await test.step("목록에서 상세로 이동", async () => {
    await page.goto("/board/promote/l?tab=promotion-list");
    await page
      .getByRole("link", { name: new RegExp(E2E_PROMOTION_TITLE) })
      .click();
    await expect(page).toHaveURL(/\/board\/promote\/d\/e2e-promotion/);
    await expect(page.getByText(E2E_PROMOTION_TITLE, { exact: true })).toBeVisible();
  });

  await test.step("참가 신청하기 링크가 설문으로 연결됨", async () => {
    await expect(
      page.getByRole("link", { name: "참가 신청하기", exact: true })
    ).toHaveAttribute("href", "/board/promote/d/e2e-promotion/survey");
  });
});

test("PROMO | 내 공연 탭에서 작성 목록으로 전환한다", async ({ page }) => {
  await mockPromotionHttp(page);

  await page.goto("/board/promote/l?tab=promotion-list");
  await page.getByRole("tab", { name: "내 공연" }).click();
  await expect(page.getByText("새로운 공연 등록하기")).toBeVisible();
  await expect(page.getByText("작성중", { exact: true })).toBeVisible();
});
