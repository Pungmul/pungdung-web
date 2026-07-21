import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveGuestRoutePolicy } from "./guest-board-route-policy";

const originalBaseUrl = process.env.BASE_URL;

function apiResponse(response: unknown) {
  return new Response(
    JSON.stringify({
      code: "SUCCESS",
      message: "ok",
      response,
      isSuccess: true,
    }),
    { status: 200 }
  );
}

function postResponse(categoryId: number | null) {
  return apiResponse({
    postId: 10,
    title: "게시글",
    content: "내용",
    viewCount: 0,
    likedNum: 0,
    commentNum: 0,
    timeSincePosted: 0,
    timeSincePostedText: "방금 전",
    author: "작성자",
    imageList: [],
    isLiked: false,
    isWriter: false,
    categoryId,
  });
}

function boardResponse(categoryId: number, isPublic: boolean) {
  return apiResponse({
    currentCategoryId: categoryId,
    boardInfo: {
      rootCategoryId: categoryId,
      rootCategoryName: "게시판",
      childCategoryName: null,
      isPublic,
      childCategories: [],
    },
    hotPost: null,
    recentPostList: {
      total: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
}

describe("resolveGuestRoutePolicy", () => {
  afterEach(() => {
    process.env.BASE_URL = originalBaseUrl;
    vi.unstubAllGlobals();
  });

  it("게시판 목록 API의 isPublic으로 숫자 게시판 게스트 접근을 판단한다", async () => {
    process.env.BASE_URL = "https://api.example.com";
    const fetchMock = vi.fn().mockResolvedValue(
      apiResponse([
        { id: 1, parentId: null, name: "자유 게시판", description: null, isPublic: true },
        { id: 2, parentId: null, name: "비공개", description: null, isPublic: false },
      ])
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(resolveGuestRoutePolicy("/board/1")).resolves.toBe("public");
    await expect(resolveGuestRoutePolicy("/board/2")).resolves.toBe("member-only");
  });

  it("게시글의 categoryId가 비공개 게시판이면 게스트 상세 진입을 막는다", async () => {
    process.env.BASE_URL = "https://api.example.com";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(postResponse(2))
      .mockResolvedValueOnce(boardResponse(2, false));
    vi.stubGlobal("fetch", fetchMock);

    await expect(resolveGuestRoutePolicy("/board/d/10")).resolves.toBe(
      "member-only"
    );
  });

  it("게시글의 categoryId가 공개 게시판이면 게스트 상세 진입을 허용한다", async () => {
    process.env.BASE_URL = "https://api.example.com";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(postResponse(1))
      .mockResolvedValueOnce(boardResponse(1, true));
    vi.stubGlobal("fetch", fetchMock);

    await expect(resolveGuestRoutePolicy("/board/d/10")).resolves.toBe(
      "public"
    );
  });

  it("게시판 정책을 확인할 수 없거나 categoryId가 없으면 게스트 접근을 막는다", async () => {
    process.env.BASE_URL = "";
    await expect(resolveGuestRoutePolicy("/board/1")).resolves.toBe(
      "member-only"
    );

    process.env.BASE_URL = "https://api.example.com";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(postResponse(null)));

    await expect(resolveGuestRoutePolicy("/board/d/10")).resolves.toBe(
      "member-only"
    );
  });
});
