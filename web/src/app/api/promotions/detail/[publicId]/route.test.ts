import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchPublic: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { GET } from "./route";

describe("GET /api/promotions/detail/[publicId]", () => {
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

  it("공개 fetch로 홍보 상세를 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchPublic.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/promotions/detail/key"), {
      params: Promise.resolve({ publicId: "key" }),
    });

    expect(mocks.fetchPublic).toHaveBeenCalledWith(
      "https://api.example.com/api/performances/key/detail"
    );
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });
});
