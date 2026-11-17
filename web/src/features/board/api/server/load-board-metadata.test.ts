import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { loadBoardMetadata } from "./load-board-metadata";

const envelope = (response: unknown) => Response.json({
  code: "OK", isSuccess: true, message: "ok", response,
});
const privateInfo = {
  currentCategoryId: 10,
  boardInfo: {
    rootCategoryId: 10, rootCategoryName: "가상 게시판", childCategoryName: null,
    isPublic: false,
    childCategories: [{ id: 11, name: "가상 분류", description: null }],
  },
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("게시판 서버 정보 조회", () => {
  it("인증된 정보는 토큰을 포함해 조회한다", async () => {
    vi.stubEnv("BASE_URL", "https://api.example.com");
    const fetchMock = vi.fn().mockResolvedValueOnce(envelope(privateInfo));
    vi.stubGlobal("fetch", fetchMock);
    expect((await loadBoardMetadata(10, "test-token"))?.boardInfo.isPublic).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/api/boards/10/info", {
      headers: { Authorization: "Bearer test-token" }, cache: "no-store", signal: expect.any(AbortSignal),
    });
  });

  it("비로그인 공개 정보는 토큰 없이 조회한다", async () => {
    vi.stubEnv("BASE_URL", "https://api.example.com");
    const publicInfo = { ...privateInfo, boardInfo: { ...privateInfo.boardInfo, isPublic: true } };
    const fetchMock = vi.fn().mockResolvedValueOnce(envelope(publicInfo));
    vi.stubGlobal("fetch", fetchMock);
    expect((await loadBoardMetadata(10, undefined))?.boardInfo.isPublic).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/api/boards/10/info", {
      headers: {}, cache: "no-store", signal: expect.any(AbortSignal),
    });
  });

  it("비공개 정보는 한 번 조회해 반환한다", async () => {
    vi.stubEnv("BASE_URL", "https://api.example.com");
    const fetchMock = vi.fn().mockResolvedValueOnce(envelope(privateInfo));
    vi.stubGlobal("fetch", fetchMock);
    expect((await loadBoardMetadata(10, undefined))?.boardInfo.isPublic).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
