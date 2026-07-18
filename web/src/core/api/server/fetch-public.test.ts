import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookies: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

import { fetchPublic } from "./fetch-public";

describe("fetchPublic", () => {
  beforeEach(() => {
    mocks.cookies.mockResolvedValue({
      get: mocks.cookieGet,
      set: mocks.cookieSet,
    });
    vi.stubGlobal("fetch", mocks.fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("토큰이 없으면 Authorization 없이 공개 API를 호출한다", async () => {
    mocks.cookieGet.mockReturnValue(undefined);
    const response = new Response(null, { status: 200 });
    mocks.fetch.mockResolvedValueOnce(response);

    await expect(fetchPublic("https://api.example.com/posts/1")).resolves.toBe(
      response
    );

    const headers = mocks.fetch.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });

  it("유효한 access token이 있으면 다른 헤더를 보존하고 Authorization을 교체한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) =>
      name === "accessToken" ? { value: "access-token" } : undefined
    );
    const response = new Response(null, { status: 200 });
    mocks.fetch.mockResolvedValueOnce(response);

    await fetchPublic("https://api.example.com/posts/1", {
      headers: {
        Authorization: "Bearer caller-token",
        "Content-Type": "application/json",
        "X-Request-Id": "request-1",
      },
    });

    const headers = mocks.fetch.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer access-token");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("X-Request-Id")).toBe("request-1");
  });

  it("access token이 없고 refresh token이 유효하면 갱신 토큰으로 개인화 요청을 한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) =>
      name === "refreshToken" ? { value: "refresh-token" } : undefined
    );
    vi.stubEnv("BASE_URL", "https://api.example.com");
    mocks.fetch
      .mockResolvedValueOnce(
        Response.json({
          response: {
            accessToken: "reissued-access-token",
            expiresIn: 900,
            refreshToken: "reissued-refresh-token",
            refreshTokenExpiresIn: 604800,
          },
        })
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await fetchPublic("https://api.example.com/posts/1");

    expect(mocks.fetch).toHaveBeenCalledTimes(2);
    const refreshedHeaders = mocks.fetch.mock.calls[1]?.[1]?.headers as Headers;
    expect(refreshedHeaders.get("Authorization")).toBe(
      "Bearer reissued-access-token"
    );
  });

  it("refresh token이 없고 인증 응답이 실패하면 일반 헤더를 보존한 게스트 요청으로 한 번 재시도한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) =>
      name === "accessToken" ? { value: "expired-access-token" } : undefined
    );
    mocks.fetch
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await fetchPublic("https://api.example.com/posts/1", {
      headers: {
        Authorization: "Bearer caller-token",
        "X-Request-Id": "request-1",
      },
    });

    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(2);
    const firstHeaders = mocks.fetch.mock.calls[0]?.[1]?.headers as Headers;
    const secondHeaders = mocks.fetch.mock.calls[1]?.[1]?.headers as Headers;
    expect(firstHeaders.get("Authorization")).toBe("Bearer expired-access-token");
    expect(secondHeaders.get("Authorization")).toBeNull();
    expect(secondHeaders.get("X-Request-Id")).toBe("request-1");
  });

  it("access token 만료 후 refresh에 성공하면 갱신 토큰으로 다시 호출한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) => {
      if (name === "accessToken") return { value: "expired-access-token" };
      if (name === "refreshToken") return { value: "refresh-token" };
      return undefined;
    });
    vi.stubEnv("BASE_URL", "https://api.example.com");
    mocks.fetch
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({
          response: {
            accessToken: "reissued-access-token",
            expiresIn: 900,
            refreshToken: "reissued-refresh-token",
            refreshTokenExpiresIn: 604800,
          },
        })
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await fetchPublic("https://api.example.com/posts/1");

    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(3);
    const refreshedHeaders = mocks.fetch.mock.calls[2]?.[1]?.headers as Headers;
    expect(refreshedHeaders.get("Authorization")).toBe(
      "Bearer reissued-access-token"
    );
  });

  it("403 응답은 권한 의미를 보존하고 게스트로 재시도하지 않는다", async () => {
    mocks.cookieGet.mockImplementation((name: string) =>
      name === "accessToken" ? { value: "access-token" } : undefined
    );
    const forbiddenResponse = new Response(null, { status: 403 });
    mocks.fetch.mockResolvedValueOnce(forbiddenResponse);

    await expect(fetchPublic("https://api.example.com/posts/1")).resolves.toBe(
      forbiddenResponse
    );
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
  });

  it("refresh 실패 후 Authorization 없이 게스트 요청으로 전환한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) => {
      if (name === "accessToken") return { value: "expired-access-token" };
      if (name === "refreshToken") return { value: "expired-refresh-token" };
      return undefined;
    });
    vi.stubEnv("BASE_URL", "https://api.example.com");
    mocks.fetch
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await fetchPublic("https://api.example.com/posts/1");

    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(3);
    const guestHeaders = mocks.fetch.mock.calls[2]?.[1]?.headers as Headers;
    expect(guestHeaders.get("Authorization")).toBeNull();
  });

  it("갱신 토큰 요청도 401이면 게스트 요청으로 한 번 전환한다", async () => {
    mocks.cookieGet.mockImplementation((name: string) => {
      if (name === "accessToken") return { value: "expired-access-token" };
      if (name === "refreshToken") return { value: "refresh-token" };
      return undefined;
    });
    vi.stubEnv("BASE_URL", "https://api.example.com");
    mocks.fetch
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({
          response: {
            accessToken: "reissued-access-token",
            expiresIn: 900,
            refreshToken: "reissued-refresh-token",
            refreshTokenExpiresIn: 604800,
          },
        })
      )
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await fetchPublic("https://api.example.com/posts/1");

    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(4);
    const guestHeaders = mocks.fetch.mock.calls[3]?.[1]?.headers as Headers;
    expect(guestHeaders.get("Authorization")).toBeNull();
  });
});
