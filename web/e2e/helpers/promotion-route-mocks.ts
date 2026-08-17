import type { Page } from "@playwright/test";

import { mockAppShellHttp } from "./route-mocks";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";
import {
  createPromotionResponse,
  E2E_PROMOTION_PUBLIC_KEY,
  E2E_PROMOTION_RESPONSE_ID,
  emptyPromotionListResponse,
  emptyUpcomingPromotionListResponse,
  myPromotionFormListResponse,
  promotionApplicationDetailResponse,
  promotionDetailResponse,
  promotionDraftResponse,
  promotionListResponse,
  promotionManageResponses,
  publishPromotionResponse,
  savePromotionAckResponse,
  upcomingPromotionListResponse,
  uploadPromotionPosterResponse,
} from "../fixtures/promotion/responses";

export type PromotionRouteMockOptions = {
  emptyList?: boolean;
  submitFailsOnce?: boolean;
  skipAppShell?: boolean;
  withUpcoming?: boolean;
  manageForbidden?: boolean;
  draftLimitNum?: number | null;
  saveFailsOnce?: boolean;
  publishFailsOnce?: boolean;
  createFailsOnce?: boolean;
  uploadFails?: boolean;
};

export async function mockPromotionHttp(
  page: Page,
  options: PromotionRouteMockOptions = {}
): Promise<void> {
  let submitFailRemaining = options.submitFailsOnce ? 1 : 0;
  let saveFailRemaining = options.saveFailsOnce ? 1 : 0;
  let publishFailRemaining = options.publishFailsOnce ? 1 : 0;
  let createFailRemaining = options.createFailsOnce ? 1 : 0;
  let upcomingCancelled = false;
  let draftTitle: string | undefined;

  if (!options.skipAppShell) {
    await mockAppShellHttp(page);
  }

  await page.route("**/api/promotions/list", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        options.emptyList ? emptyPromotionListResponse : promotionListResponse
      ),
    });
  });
  await page.route("**/api/promotions/create", async (route) => {
    if (createFailRemaining > 0) {
      createFailRemaining -= 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("공연 생성에 실패했습니다.")),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createPromotionResponse),
    });
  });
  await page.route("**/api/promotions/forms/*/save", async (route) => {
    if (saveFailRemaining > 0) {
      saveFailRemaining -= 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("임시 저장 실패")),
      });
      return;
    }
    const raw = route.request().postData() ?? "";
    try {
      const body = JSON.parse(raw) as {
        snapshot?: { title?: string | null };
      };
      if (typeof body.snapshot?.title === "string") {
        draftTitle = body.snapshot.title;
      }
    } catch {
      // 저장 본문을 읽지 못하면 기존 초안 제목을 유지
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(savePromotionAckResponse),
    });
  });
  await page.route(
    "**/api/promotions/forms/*/submit",
    async (route) => {
      if (publishFailRemaining > 0) {
        publishFailRemaining -= 1;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("게시에 실패했습니다.")),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(publishPromotionResponse),
      });
    }
  );
  await page.route(
    "**/api/promotions/forms/*/uploadImage",
    async (route) => {
      if (options.uploadFails) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("포스터 업로드에 실패했습니다.")),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(uploadPromotionPosterResponse),
      });
    }
  );
  await page.route(
    "**/api/promotions/forms/*",
    async (route) => {
      const path = new URL(route.request().url()).pathname;
      if (
        path.endsWith("/me") ||
        path.endsWith("/save") ||
        path.endsWith("/submit") ||
        path.endsWith("/manage") ||
        path.endsWith("/uploadImage")
      ) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          promotionDraftResponse(
            options.draftLimitNum ?? 50,
            draftTitle ?? "임시저장 공연"
          )
        ),
      });
    }
  );
  await page.route("**/api/promotions/forms/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(myPromotionFormListResponse),
    });
  });
  await page.route("**/api/promotions/responses/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        options.withUpcoming && !upcomingCancelled
          ? upcomingPromotionListResponse
          : emptyUpcomingPromotionListResponse
      ),
    });
  });
  await page.route(
    `**/api/promotions/responses/${E2E_PROMOTION_RESPONSE_ID}`,
    async (route) => {
      if (route.request().method() === "DELETE") {
        upcomingCancelled = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(promotionApplicationDetailResponse),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(promotionApplicationDetailResponse),
      });
    }
  );
  await page.route(
    (url) =>
      url.pathname.includes("/api/promotions/forms/") &&
      url.pathname.endsWith("/manage"),
    async (route) => {
      if (options.manageForbidden) {
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("권한이 없습니다.")),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(promotionManageResponses),
      });
    }
  );
  await page.route(
    `**/api/promotions/detail/${E2E_PROMOTION_PUBLIC_KEY}`,
    async (route) => {
      if (options.manageForbidden) {
        // 관리 페이지는 form/detail 쿼리가 모두 비어야 차단 안내가 나온다
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("권한이 없습니다.")),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(promotionDetailResponse),
      });
    }
  );
  await page.route(
    `**/api/promotions/submit/${E2E_PROMOTION_PUBLIC_KEY}`,
    async (route) => {
      if (submitFailRemaining > 0) {
        submitFailRemaining -= 1;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("설문 제출 중 오류가 발생했습니다.")),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope(null)),
      });
    }
  );
}
