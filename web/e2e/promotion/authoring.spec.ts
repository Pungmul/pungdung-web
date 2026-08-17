import { expect, test } from "@playwright/test";

import {
  E2E_PROMOTION_DRAFT_ID,
  E2E_PROMOTION_PUBLIC_KEY,
} from "../fixtures/promotion/responses";
import { labeledInput } from "../helpers/labeled-input";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO | 빈 목록에서 초안을 만든다", async ({ page }) => {
  await mockPromotionHttp(page, { emptyList: true });

  await page.goto("/board/promote/l?tab=promotion-list", {
    waitUntil: "domcontentloaded",
  });
  await page
    .getByRole("button", { name: "새로운 공연 등록하기", exact: true })
    .click();
  await expect(page).toHaveURL(
    new RegExp(`formId=${E2E_PROMOTION_DRAFT_ID}`)
  );
  await expect(page.getByText("공연 등록", { exact: true })).toBeVisible();
});

test("PROMO-013 | 초안을 임시 저장하고 다시 열면 값이 남는다", async ({
  page,
}) => {
  await mockPromotionHttp(page);

  await test.step("초안 화면에서 제목을 저장", async () => {
    await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByText("공연 등록", { exact: true })).toBeVisible();
    await labeledInput(page, "제목").fill("재진입 공연");
    await page.getByRole("button", { name: "임시 저장", exact: true }).click();
    await expect(page.getByText("임시 저장 완료")).toBeVisible();
  });

  await test.step("같은 초안에 다시 들어가면 제목이 보임", async () => {
    await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(labeledInput(page, "제목")).toHaveValue("재진입 공연");
  });
});

test("PROMO-003 | 초안을 게시하면 성공 안내를 보여준다", async ({ page }) => {
  await mockPromotionHttp(page);

  await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: "등록하기", exact: true }).click();
  await expect(page.getByText("공연이 게시되었습니다!")).toBeVisible();
  await expect(page.getByText("게시에 실패했습니다.")).toHaveCount(0);
});

test("PROMO-020 | 인원 제한 없음을 켜면 입력칸이 비활성이다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { draftLimitNum: 50 });

  await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("label").filter({ hasText: "제한 없음" }).click();
  await expect(labeledInput(page, "제한 인원")).toBeDisabled();
  await expect(labeledInput(page, "제한 인원")).toHaveAttribute(
    "placeholder",
    "제한 없음"
  );
});

test("PROMO | 게시된 공연 통계 화면을 연다", async ({ page }) => {
  await mockPromotionHttp(page);

  await page.goto(
    `/board/promote/m?formId=${E2E_PROMOTION_DRAFT_ID}&performanceId=${E2E_PROMOTION_PUBLIC_KEY}`
  );
  await expect(page.getByText("공연 관리", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "각 신청별 답변" })).toBeVisible();
  await page.getByRole("tab", { name: "전체 답변 통계" }).click();
  await expect(page.getByRole("tab", { name: "전체 답변 통계" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});
