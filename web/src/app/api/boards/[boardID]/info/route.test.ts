import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchPublic: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { GET } from "./route";

describe("GET /api/boards/[boardID]/info", () => {
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

  it("공개 fetch로 게시판 정보를 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchPublic.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/boards/7/info"), {
      params: Promise.resolve({ boardID: "7" }),
    });

    expect(mocks.fetchPublic).toHaveBeenCalledWith(
      "https://api.example.com/api/boards/7"
    );
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });
});
