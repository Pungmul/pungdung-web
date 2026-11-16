import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ fetchPublic: vi.fn() }));

vi.mock("@/core/api/server", () => ({
  fetchPublic: mocks.fetchPublic,
  createValidatedUpstreamResponse: (response: Response) => response,
  proxyFailureError: () => new Response(null, { status: 500 }),
}));

import { GET as getInfo } from "./[boardID]/info/route";
import { GET as getList } from "./[boardID]/list/route";

describe("게시판 프록시 계약", () => {
  const params = { params: Promise.resolve({ boardID: "14" }) };

  beforeEach(() => {
    vi.stubEnv("BASE_URL", "https://example.com");
    mocks.fetchPublic.mockReset();
    mocks.fetchPublic.mockResolvedValue(new Response("{}", { status: 200 }));
  });

  it("정보는 info 경로로 요청한다", async () => {
    await getInfo(new Request("http://localhost"), params);
    expect(mocks.fetchPublic).toHaveBeenCalledWith("https://example.com/api/boards/14/info");
  });

  it.each([[1, ""], [2, "/add"]])("%i페이지를 올바른 경로로 요청한다", async (page, suffix) => {
    await getList(new Request(`http://localhost/api?page=${page}&size=10`), params);
    expect(String(mocks.fetchPublic.mock.calls[0]?.[0])).toBe(
      `https://example.com/api/boards/14${suffix}?page=${page}&size=10`
    );
  });

  it("403 응답은 본문을 제외하고 전달한다", async () => {
    mocks.fetchPublic.mockResolvedValue(new Response("private details", { status: 403 }));
    const response = await getList(new Request("http://localhost/api?page=1"), params);
    expect(response.status).toBe(403);
    expect(await response.text()).toBe("");
  });
});
