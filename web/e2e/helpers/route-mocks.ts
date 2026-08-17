import type { Page } from "@playwright/test";

import { E2E_ACCESS_TOKEN } from "./auth";
import { clubListCatalogResponse } from "../fixtures/club-list";
import { failEnvelope, okEnvelope } from "../fixtures/envelope";
import {
  authToken,
  chatRoomListEmpty,
  clubListEmpty,
  clubListWithSchool,
  lightningCreateSuccess,
  lightningSearchEmpty,
  lightningSearchWithCreated,
  lightningSearchWithMeeting,
  lightningSearchWithSchool,
  lightningSearchWithTwoMeetings,
  lightningStatusNotParticipating,
  lightningStatusOrganizing,
  lightningStatusOrganizingCreated,
  lightningStatusParticipating,
  myPageWithoutSchool,
  myPageWithSchool,
  nearbyLightningEmpty,
  nearbyLightningWithMeeting,
  userLocation,
} from "../fixtures/lightning/responses";

export type LightningParticipationState = "none" | "member" | "organizer";
export type NearbyListState = "empty" | "list";

export type LightningRouteMockOptions = {
  hasSchool?: boolean;
  withMeetings?: boolean;
  withTwoMeetings?: boolean;
  withSchoolMeetings?: boolean;
  participation?: LightningParticipationState;
  nearby?: NearbyListState;
  joinFails?: boolean;
  createFails?: boolean;
  createFailMessage?: string;
};

async function fulfillJson(page: Page, urlGlob: string, body: unknown) {
  await page.route(urlGlob, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

function statusBody(
  participation: LightningParticipationState,
  created = false
) {
  if (participation === "organizer") {
    return created
      ? lightningStatusOrganizingCreated
      : lightningStatusOrganizing;
  }
  if (participation === "member") {
    return lightningStatusParticipating;
  }
  return lightningStatusNotParticipating;
}

function searchBody(options: LightningRouteMockOptions) {
  if (options.withSchoolMeetings) {
    return lightningSearchWithSchool;
  }
  if (options.withTwoMeetings) {
    return lightningSearchWithTwoMeetings;
  }
  return options.withMeetings === false
    ? lightningSearchEmpty
    : lightningSearchWithMeeting;
}

const CHANGE_PASSWORD_INFO_OK = okEnvelope({
  kakaoSignup: false,
  firstPasswordChange: false,
});

const LOGOUT_OK_HEADERS = {
  "Set-Cookie":
    "accessToken=; Path=/; Max-Age=0\nrefreshToken=; Path=/; Max-Age=0",
};

function apiPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

// 알려진 API는 유효한 happy 본문으로 즉시 응답
function defaultApiFulfill(
  url: string,
  method: string
): {
  body: unknown;
  headers?: Record<string, string>;
} {
  const path = apiPathname(url);

  if (path.includes("/api/club-list")) {
    return { body: clubListCatalogResponse };
  }
  if (path.includes("/api/auth/change-password/info")) {
    return { body: CHANGE_PASSWORD_INFO_OK };
  }
  if (path.includes("/api/users/me")) {
    return { body: myPageWithoutSchool };
  }
  if (path.includes("/api/auth/token")) {
    return {
      body: {
        ...authToken,
        response: { accessToken: E2E_ACCESS_TOKEN },
      },
    };
  }
  if (path.includes("/api/chats/roomlist")) {
    return { body: chatRoomListEmpty };
  }
  if (
    path.includes("/api/notification") ||
    path.includes("/api/notifications")
  ) {
    return { body: okEnvelope([]) };
  }
  if (path.includes("/api/auth/logout") && method === "POST") {
    return {
      body: { success: true, message: "로그아웃 완료" },
      headers: LOGOUT_OK_HEADERS,
    };
  }
  if (path.includes("/api/friends/load")) {
    return { body: okEnvelope([]) };
  }

  return { body: okEnvelope({}) };
}

export async function mockAppShellHttp(page: Page): Promise<void> {
  await page.route("**/api/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204 });
      return;
    }
    const url = route.request().url();
    const method = route.request().method();
    const { body, headers } = defaultApiFulfill(url, method);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: headers ?? {},
      body: JSON.stringify(body),
    });
  });
}

export async function mockLightningHttp(
  page: Page,
  options: LightningRouteMockOptions = {}
): Promise<void> {
  const {
    hasSchool = false,
    nearby = "empty",
    joinFails = false,
    createFails = false,
    createFailMessage = "지금은 번개를 만들 수 없습니다.",
  } = options;
  let participation: LightningParticipationState =
    options.participation ?? "none";
  let createdMeeting = false;

  await mockAppShellHttp(page);

  await fulfillJson(
    page,
    "**/api/users/me",
    hasSchool ? myPageWithSchool : myPageWithoutSchool
  );
  await fulfillJson(
    page,
    "**/api/club-list",
    hasSchool ? clubListWithSchool : clubListEmpty
  );
  await page.route("**/api/location", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope(null)),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(userLocation),
    });
  });
  let search = searchBody(options);
  await page.route("**/api/lightning/search", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(search),
    });
  });
  await page.route("**/api/lightning/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(statusBody(participation, createdMeeting)),
    });
  });
  await fulfillJson(
    page,
    "**/api/lightning/nearby",
    nearby === "list" ? nearbyLightningWithMeeting : nearbyLightningEmpty
  );
  await page.route("**/api/lightning/join", async (route) => {
    if (joinFails) {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify(failEnvelope("번개 참여에 실패했습니다.")),
      });
      return;
    }
    participation = "member";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/lightning/exit", async (route) => {
    participation = "none";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope(null)),
    });
  });
  await page.route("**/api/lightning/cancel", async (route) => {
    participation = "none";
    search = lightningSearchEmpty;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(okEnvelope({ message: "ok" })),
    });
  });
  let createFailRemaining = createFails ? 1 : 0;
  await page.route("**/api/lightning/create", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    if (createFailRemaining > 0) {
      createFailRemaining -= 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          failEnvelope(createFailMessage)
        ),
      });
      return;
    }
    participation = "organizer";
    createdMeeting = true;
    search = lightningSearchWithCreated;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(lightningCreateSuccess),
    });
  });
}
