import { expect, test } from "@playwright/test";

import { E2E_PROMOTION_RESPONSE_ID } from "../fixtures/promotion/responses";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO-046 | 신청 취소를 닫으면 확정 전 상태를 유지한다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { withUpcoming: true });
  let cancelCalled = false;
  page.on("request", (request) => {
    if (
      request.method() === "DELETE" &&
      request.url().includes(`/api/promotions/responses/${E2E_PROMOTION_RESPONSE_ID}`)
    ) {
      cancelCalled = true;
    }
  });

  await test.step("신청 상세에서 취소 확인창을 연다", async () => {
    await page.goto(
      `/board/r/${E2E_PROMOTION_RESPONSE_ID}?targetPerformanceKey=e2e-promotion`,
      { waitUntil: "domcontentloaded" }
    );
    await page.getByRole("button", { name: "취소하기", exact: true }).click();
  });

  await test.step("확인창을 닫으면 요청이 나가지 않음", async () => {
    await expect(page.getByText("신청 취소", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "닫기", exact: true }).click();
    await expect(page).toHaveURL(
      new RegExp(`/board/r/${E2E_PROMOTION_RESPONSE_ID}`)
    );
    expect(cancelCalled).toBe(false);
  });
});

test("PROMO-046 | 신청을 취소하면 예정 목록에서 사라진다", async ({ page }) => {
  await mockPromotionHttp(page, { withUpcoming: true });

  await page.goto(
    `/board/r/${E2E_PROMOTION_RESPONSE_ID}?targetPerformanceKey=e2e-promotion`,
    { waitUntil: "domcontentloaded" }
  );
  await page.getByRole("button", { name: "취소하기", exact: true }).click();
  await expect(
    page.getByText("공연 관람 신청을 취소하시겠습니까?", { exact: true })
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .filter({ hasText: "신청 취소" })
    .getByRole("button", { name: "취소하기", exact: true })
    .click();

  await expect(page).toHaveURL(/\/board\/promote\/upcoming/, { timeout: 20_000 });
  await expect(
    page.getByText("관람 예정인 공연이 없어요.", { exact: true })
  ).toBeVisible();
});
