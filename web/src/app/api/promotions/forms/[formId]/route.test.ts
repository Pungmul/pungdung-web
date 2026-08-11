import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createValidatedUpstreamResponse: vi.fn(),
  fetchWithRefresh: vi.fn(),
  proxyFailureError: vi.fn(),
}));

vi.mock("@/core/api/server", () => mocks);

import { DELETE, GET } from "./route";

describe("/api/promotions/forms/[formId]", () => {
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

  it("GET은 draft 경로로 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchWithRefresh.mockResolvedValueOnce(upstreamResponse);

    await GET(new Request("http://localhost/api/promotions/forms/12"), {
      params: Promise.resolve({ formId: "12" }),
    });

    expect(mocks.fetchWithRefresh).toHaveBeenCalledWith(
      "https://api.example.com/api/performances/12/draft"
    );
  });

  it("DELETE는 /draft 없이 performances/{formId}로 프록시한다", async () => {
    const upstreamResponse = new Response();
    mocks.fetchWithRefresh.mockResolvedValueOnce(upstreamResponse);

    await DELETE(new Request("http://localhost/api/promotions/forms/12"), {
      params: Promise.resolve({ formId: "12" }),
    });

    expect(mocks.fetchWithRefresh).toHaveBeenCalledWith(
      "https://api.example.com/api/performances/12",
      { method: "DELETE" }
    );
    expect(mocks.createValidatedUpstreamResponse).toHaveBeenCalledWith(
      upstreamResponse
    );
  });

  it("DELETE는 숫자 아닌 formId를 거절한다", async () => {
    const response = await DELETE(
      new Request("http://localhost/api/promotions/forms/abc"),
      { params: Promise.resolve({ formId: "abc" }) }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.isSuccess).toBe(false);
    expect(mocks.fetchWithRefresh).not.toHaveBeenCalled();
  });
});
