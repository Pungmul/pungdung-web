import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchWithRefresh: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { GET } from "./route";

describe("GET /api/comments", () => {
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

  it("postId가 숫자가 아니면 400을 반환한다", async () => {
    const response = await GET(
      new Request("http://localhost/api/comments?postId=invalid")
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "INVALID_REQUEST",
    });
    expect(mocks.fetchWithRefresh).not.toHaveBeenCalled();
  });

  it("댓글 목록 upstream 요청을 postId와 함께 전달한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchWithRefresh.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/comments?postId=10"));

    expect(mocks.fetchWithRefresh).toHaveBeenCalledWith(
      "https://api.example.com/api/comments?postId=10"
    );
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });
});
