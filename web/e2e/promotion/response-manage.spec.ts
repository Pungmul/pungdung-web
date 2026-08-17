import { expect, test } from "@playwright/test";

import {
  E2E_PROMOTION_DRAFT_ID,
  E2E_PROMOTION_PUBLIC_KEY,
} from "../fixtures/promotion/responses";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO-012 | 권한 없는 응답 관리 화면을 막는다", async ({ page }) => {
  await mockPromotionHttp(page, { manageForbidden: true });

  await page.goto(
    `/board/promote/m?formId=${E2E_PROMOTION_DRAFT_ID}&performanceId=${E2E_PROMOTION_PUBLIC_KEY}`,
    { waitUntil: "domcontentloaded" }
  );

  await expect(page.getByText("폼을 찾을 수 없습니다.", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "각 신청별 답변" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "전체 답변 통계" })).toHaveCount(0);
});
