import { beforeEach, describe, expect, it, vi } from "vitest";

import { MAP_LOCATION_FALLBACK } from "../constant";

vi.mock("../api/server", () => ({
  searchSchoolPlaceByKeyword: vi.fn(),
}));

import { searchSchoolPlaceByKeyword } from "../api/server";

import { resolveFallbackLocation } from "./resolve-fallback-location";

const searchSchoolPlaceByKeywordMock = vi.mocked(searchSchoolPlaceByKeyword);

describe("resolveFallbackLocation", () => {
  beforeEach(() => {
    searchSchoolPlaceByKeywordMock.mockReset();
  });

  it("학교 검색이 되면 학교다", async () => {
    const school = { latitude: 37.6, longitude: 126.9 };
    searchSchoolPlaceByKeywordMock.mockResolvedValue(school);

    await expect(resolveFallbackLocation("상명대")).resolves.toEqual({
      location: school,
      source: "school",
      label: "상명대",
    });
  });

  it("학교 검색이 비면 서울역이다", async () => {
    searchSchoolPlaceByKeywordMock.mockResolvedValue(null);

    await expect(resolveFallbackLocation("상명대")).resolves.toEqual({
      location: MAP_LOCATION_FALLBACK,
      source: "seoul_station",
      label: "서울역",
    });
  });

  it("학교 이름이 없으면 서울역이다", async () => {
    await expect(resolveFallbackLocation(null)).resolves.toEqual({
      location: MAP_LOCATION_FALLBACK,
      source: "seoul_station",
      label: "서울역",
    });

    expect(searchSchoolPlaceByKeywordMock).not.toHaveBeenCalled();
  });
});
