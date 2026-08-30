import { expect, test } from "@playwright/test";

import {
  E2E_PROMOTION_PUBLIC_KEY,
  E2E_PROMOTION_TITLE,
} from "../fixtures/promotion/responses";
import { mockPromotionHttp } from "../helpers/promotion-route-mocks";

test("PROMO-004 | 공개 공연을 신청하고 상세로 돌아온다", async ({ page }) => {
  test.setTimeout(90_000);
  await mockPromotionHttp(page);

  await test.step("공연 목록에서 상세와 설문으로 이동", async () => {
    await page.goto("/board/promote/l?tab=promotion-list");
    await page
      .getByRole("link", { name: new RegExp(E2E_PROMOTION_TITLE) })
      .click();
    await expect(page).toHaveURL(
      new RegExp(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}`),
      { timeout: 45_000 }
    );
    const applicationLink = page.getByRole("link", {
      name: "참가 신청하기",
      exact: true,
    });
    await expect(applicationLink).toHaveAttribute(
      "href",
      `/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}/survey`
    );
    await page.goto(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}/survey`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(
      new RegExp(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}/survey`),
      { timeout: 45_000 }
    );
  });

  await test.step("하단 친구 안내에서 관람 신청한 친구를 확인", async () => {
    await page
      .getByRole("button", {
        name: "1명의 친구들이 이 공연 관람을 신청했어요",
      })
      .click();
    await expect(
      page.getByRole("region", { name: "공연 관람 신청 친구 목록" })
    ).toBeVisible();
    await expect(page.getByText("공연 친구", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "친구 목록 닫기" }).click();
  });

  await test.step("필수 응답을 제출하면 상세로 돌아옴", async () => {
    await page.getByPlaceholder("관람 이유를 입력해주세요.").fill("공연을 관람합니다.");
    const dialogPromise = page.waitForEvent("dialog");
    const clickPromise = page
      .getByRole("button", { name: "설문 제출하기", exact: true })
      .click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe("설문이 성공적으로 제출되었습니다!");
    await dialog.accept();
    await clickPromise;
    await expect(page).toHaveURL(
      new RegExp(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}$`),
      { timeout: 45_000 }
    );
    await expect(page.getByText(E2E_PROMOTION_TITLE, { exact: true })).toBeVisible();
  });
});

test("PROMO-011 | 설문 제출 실패 후 응답을 유지하고 재시도한다", async ({
  page,
}) => {
  await mockPromotionHttp(page, { submitFailsOnce: true });

  await test.step("설문 제출 실패 후 작성한 답변이 유지됨", async () => {
    await page.goto(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}/survey`);
    await page.getByPlaceholder("관람 이유를 입력해주세요.").fill("재시도 답변");
    const dialogPromise = page.waitForEvent("dialog");
    const clickPromise = page
      .getByRole("button", { name: "설문 제출하기", exact: true })
      .click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe("설문 제출 중 오류가 발생했습니다.");
    await dialog.accept();
    await clickPromise;
    await expect(page).toHaveURL(
      new RegExp(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}/survey`)
    );
    await expect(page.getByPlaceholder("관람 이유를 입력해주세요.")).toHaveValue(
      "재시도 답변"
    );
  });

  await test.step("같은 답변을 다시 제출하면 상세로 이동", async () => {
    const dialogPromise = page.waitForEvent("dialog");
    const clickPromise = page
      .getByRole("button", { name: "설문 제출하기", exact: true })
      .click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe("설문이 성공적으로 제출되었습니다!");
    await dialog.accept();
    await clickPromise;
    await expect(page).toHaveURL(
      new RegExp(`/board/promote/d/${E2E_PROMOTION_PUBLIC_KEY}$`),
      { timeout: 45_000 }
    );
  });
});
