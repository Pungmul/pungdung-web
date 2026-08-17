import { expect, test } from "@playwright/test";

import {
  E2E_PROMOTION_PUBLIC_KEY,
  E2E_PROMOTION_TITLE,
} from "../fixtures/promotion/responses";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test.use({ storageState: { cookies: [], origins: [] } });

test("PROMO | 게스트가 참가 신청하면 로그인 안내를 확인한다", async ({
  page,
}) => {
  await mockPromotionHttp(page);

  await test.step("공개 공연 상세에서 참가 신청을 누름", async () => {
    await page.goto(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}`);
    await expect(page.getByText(E2E_PROMOTION_TITLE, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "참가 신청하기", exact: true }).click();
  });

  await test.step("로그인 안내가 표시됨", async () => {
    await expect(
      page.getByText("로그인 필요", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "로그인하기", exact: true })
    ).toBeVisible();
  });
});
