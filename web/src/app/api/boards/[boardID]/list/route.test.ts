import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchPublic: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { GET } from "./route";

describe("GET /api/boards/[boardID]/list", () => {
  beforeEach(() => {
    vi.stubEnv("BASE_URL", "https://api.example.com");
    mocks.createValidatedUpstreamResponse.mockReturnValue(
      Response.json({ isSuccess: true })
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("페이지 파라미터를 유지해 공개 fetch로 게시글 목록을 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchPublic.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/boards/7/list?page=2&size=10"), {
      params: Promise.resolve({ boardID: "7" }),
    });

    expect(mocks.fetchPublic).toHaveBeenCalledWith(
      new URL("https://api.example.com/api/boards/7?page=2&size=10")
    );
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });
});
