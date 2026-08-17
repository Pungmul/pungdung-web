import { expect, test } from "@playwright/test";

import { E2E_PROMOTION_DRAFT_ID } from "../fixtures/promotion/responses";
import { labeledInput } from "../helpers/labeled-input";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO-014 | 임시 저장 실패 후 작성값을 유지하고 재시도한다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { saveFailsOnce: true });

  await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`);
  await labeledInput(page, "제목").fill("유지할 공연 제목");
  await page.getByRole("button", { name: "임시 저장", exact: true }).click();
  await expect(page.getByText("임시 저장 실패")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`formId=${E2E_PROMOTION_DRAFT_ID}`));
  await expect(labeledInput(page, "제목")).toHaveValue("유지할 공연 제목");

  await page.getByRole("button", { name: "임시 저장", exact: true }).click();
  await expect(page.getByText("임시 저장 완료")).toBeVisible();
  await expect(page.getByText("공연이 게시되었습니다!")).toHaveCount(0);
});

test("PROMO-009 | 게시 실패 후 중복 생성 없이 재시도한다", async ({ page }) => {
  await mockPromotionHttp(page, { publishFailsOnce: true });
  let saveCount = 0;
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().includes("/save")) {
      saveCount += 1;
    }
  });

  await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`);
  await page.getByRole("button", { name: "등록하기", exact: true }).click();
  await expect(page.getByText("게시에 실패했습니다.")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`formId=${E2E_PROMOTION_DRAFT_ID}`));

  await page.getByRole("button", { name: "등록하기", exact: true }).click();
  await expect(page.getByText("공연이 게시되었습니다!")).toBeVisible();
  expect(saveCount).toBeGreaterThanOrEqual(1);
});

test("PROMO-022 | 포스터 업로드 실패 후 기존 화면을 유지한다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { uploadFails: true });

  await page.goto(`/board/promote/f?formId=${E2E_PROMOTION_DRAFT_ID}`);
  await page.getByLabel("포스터 업로드").setInputFiles({
    name: "poster.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    ),
  });

  await expect(page.getByText("포스터 업로드 실패", { exact: true })).toBeVisible();
  await expect(page.getByText("포스터 업로드에 실패했습니다.")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`formId=${E2E_PROMOTION_DRAFT_ID}`));
  await page.getByRole("button", { name: "확인", exact: true }).click();
  await expect(page.getByRole("button", { name: "등록하기", exact: true })).toBeVisible();
});
