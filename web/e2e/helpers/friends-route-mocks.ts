import type { Page } from "@playwright/test";

import { mockAppShellHttp } from "./route-mocks";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";
import {
  e2eFriendUser,
  e2ePendingUser,
  e2eSelfSearchUser,
  emptyFriendsLoadResponse,
  friendsLoadWithAcceptedResponse,
  friendsLoadWithIncomingResponse,
  friendsSearchResponse,
} from "../fixtures/friends/responses";

export type FriendsRouteMockOptions = {
  emptyLists?: boolean;
  withIncoming?: boolean;
  searchSelf?: boolean;
  emptySearch?: boolean;
  requestFails?: boolean;
  skipAppShell?: boolean;
};

export async function mockFriendsHttp(
  page: Page,
  options: FriendsRouteMockOptions = {}
): Promise<void> {
  let loadBody = emptyFriendsLoadResponse;
  if (!options.emptyLists) {
    loadBody = options.withIncoming
      ? friendsLoadWithIncomingResponse
      : friendsLoadWithAcceptedResponse;
  }

  if (!options.skipAppShell) {
    await mockAppShellHttp(page);
  }

  await page.route("**/api/friends/load**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(loadBody),
    });
  });
  await page.route("**/api/friends/search**", async (route) => {
    if (options.emptySearch) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope([])),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        friendsSearchResponse(
          options.searchSelf ? e2eSelfSearchUser : e2eFriendUser
        )
      ),
    });
  });
  await page.route("**/api/friends/add**", async (route) => {
    if (options.requestFails) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("친구 요청 실패")),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/friends/accept**", async (route) => {
    loadBody = okEnvelope({
      acceptedFriendList: [
        {
          friendRequestId: 302,
          friendStatus: "ACCEPTED",
          simpleUserDTO: e2ePendingUser,
          isRequestSentByUser: false,
        },
      ],
      pendingReceivedList: [],
      pendingSentList: [],
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/friends/decline**", async (route) => {
    loadBody = emptyFriendsLoadResponse;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/users/info**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        okEnvelope({
          ...(options.searchSelf ? e2eSelfSearchUser : e2eFriendUser),
          email: "friend@example.com",
        })
      ),
    });
  });
}
