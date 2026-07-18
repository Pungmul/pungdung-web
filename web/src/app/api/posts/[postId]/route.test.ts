import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchPublic: vi.fn(),
  fetchWithRefresh: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { GET } from "./route";

describe("GET /api/posts/[postId]", () => {
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

  it("공개 fetch로 게시글 본문을 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchPublic.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/posts/10"), {
      params: Promise.resolve({ postId: "10" }),
    });

    expect(mocks.fetchPublic).toHaveBeenCalledWith(
      "https://api.example.com/api/posts/10"
    );
    expect(mocks.fetchWithRefresh).not.toHaveBeenCalled();
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });
});
