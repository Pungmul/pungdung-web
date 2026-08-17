import type { Page } from "@playwright/test";

import { mockAppShellHttp } from "./route-mocks";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";
import {
  emptyUnreadNotificationListResponse,
  unreadNotificationListResponse,
} from "../fixtures/notification/responses";

export type NotificationRouteMockOptions = {
  emptyList?: boolean;
  tokenRegisterFails?: boolean;
  tokenInvalidateFails?: boolean;
  skipAppShell?: boolean;
};

export async function mockNotificationHttp(
  page: Page,
  options: NotificationRouteMockOptions = {}
): Promise<void> {
  let listEmpty = Boolean(options.emptyList);

  if (!options.skipAppShell) {
    await mockAppShellHttp(page);
  }

  await page.route("**/api/notification/notReadMessage", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        listEmpty
          ? emptyUnreadNotificationListResponse
          : unreadNotificationListResponse
      ),
    });
  });
  await page.route("**/api/notification/notReadCnt", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(listEmpty ? 0 : 1)),
    });
  });
  await page.route("**/api/notification/*/read", async (route) => {
    listEmpty = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/notification/read-all", async (route) => {
    listEmpty = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/notification/token", async (route) => {
    if (route.request().method() === "POST" && options.tokenRegisterFails) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("토큰 등록 실패")),
      });
      return;
    }
    if (route.request().method() === "DELETE" && options.tokenInvalidateFails) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("토큰 해제 실패")),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(true)),
    });
  });
}
