import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { searchSchoolPlaceByKeyword } from "./search-school-place.api";

describe("searchSchoolPlaceByKeyword", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_KAKAO_REST_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("2xx면 학교 좌표를 반환한다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          {
            x: "126.9",
            y: "37.6",
            category_group_code: "SC4",
          },
        ],
      }),
    });

    await expect(searchSchoolPlaceByKeyword("상명대")).resolves.toEqual({
      latitude: 37.6,
      longitude: 126.9,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      next: { revalidate: 60 * 60 * 24 },
    });
  });

  it("HTTP 에러면 null이고 호출부에서 삼킨다", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    await expect(searchSchoolPlaceByKeyword("상명대")).resolves.toBeNull();
  });
});
