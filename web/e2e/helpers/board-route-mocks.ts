import type { Page } from "@playwright/test";

import { mockAppShellHttp } from "./route-mocks";
import {
  boardDataResponse,
  createdPostDetailResponse,
  createPostResponse,
  E2E_CREATED_POST_ID,
  E2E_POST_ID,
  E2E_SEARCH_KEYWORD,
  emptyCommentListResponse,
  emptySearchPostListResponse,
  hotPostListResponse,
  postDetailResponse,
  searchPostListResponse,
} from "../fixtures/board/responses";
import { failEnvelope } from "../fixtures/envelope";

export type BoardRouteMockOptions = {
  createFailsOnce?: boolean;
  skipAppShell?: boolean;
};

function apiPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function requestBodyText(route: {
  request(): { postData(): string | null; postDataBuffer(): Buffer | null };
}): string {
  return (
    route.request().postData() ??
    route.request().postDataBuffer()?.toString("utf8") ??
    ""
  );
}

function parseCreatePostPayload(raw: string): {
  title: string;
  text: string;
  anonymity: boolean;
} | null {
  const postDataMatch =
    /name="postData"[\s\S]*?\r?\n\r?\n(\{.*?\})\r?\n--/.exec(raw);
  if (!postDataMatch) {
    return null;
  }

  try {
    const payload = JSON.parse(postDataMatch[1]) as {
      title?: unknown;
      text?: unknown;
      anonymity?: unknown;
    };
    if (
      typeof payload.title !== "string" ||
      typeof payload.text !== "string" ||
      typeof payload.anonymity !== "boolean"
    ) {
      return null;
    }
    return payload as {
      title: string;
      text: string;
      anonymity: boolean;
    };
  } catch {
    return null;
  }
}

export async function mockBoardHttp(
  page: Page,
  options: BoardRouteMockOptions = {}
): Promise<void> {
  let createdTitle = "E2E 작성 제목";
  let createdContent = "E2E 작성 본문";
  let createFailRemaining = options.createFailsOnce ? 1 : 0;

  if (!options.skipAppShell) {
    await mockAppShellHttp(page);
  }

  await page.route("**/api/boards/hot-post**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(hotPostListResponse),
    });
  });
  await page.route("**/api/boards/**/search**", async (route) => {
    const url = new URL(route.request().url());
    const keyword = url.searchParams.get("keyword") ?? "";
    const empty = keyword !== "" && keyword !== E2E_SEARCH_KEYWORD;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        empty ? emptySearchPostListResponse : searchPostListResponse
      ),
    });
  });
  await page.route("**/api/boards/**/list**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(boardDataResponse()),
    });
  });
  await page.route("**/api/boards/**/info**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(boardDataResponse()),
    });
  });
  await page.route("**/api/posts**", async (route) => {
    const method = route.request().method();
    const path = apiPathname(route.request().url());

    if (method === "POST" && path === "/api/posts") {
      const parsed = parseCreatePostPayload(requestBodyText(route));
      if (!parsed) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("게시물 작성에 실패했습니다.")),
        });
        return;
      }
      createdTitle = parsed.title;
      createdContent = parsed.text;

      if (createFailRemaining > 0) {
        createFailRemaining -= 1;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(failEnvelope("게시물 작성에 실패했습니다.")),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(createPostResponse),
      });
      return;
    }

    if (path.endsWith(`/api/posts/${E2E_CREATED_POST_ID}`)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          createdPostDetailResponse(createdTitle, createdContent)
        ),
      });
      return;
    }

    if (path.endsWith(`/api/posts/${E2E_POST_ID}`)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(postDetailResponse),
      });
      return;
    }

    await route.fallback();
  });
  await page.route(`**/api/posts/${E2E_POST_ID}`, async (route) => {
    if (route.request().method() === "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(postDetailResponse),
    });
  });
  await page.route(`**/api/posts/${E2E_CREATED_POST_ID}`, async (route) => {
    if (route.request().method() === "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        createdPostDetailResponse(createdTitle, createdContent)
      ),
    });
  });
  await page.route("**/api/comments**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(emptyCommentListResponse),
    });
  });
}
