import { describe, expect, it } from "vitest";

import { pickSchoolPlaceFromKakaoDocuments } from "./map-kakao-keyword-search";

describe("pickSchoolPlaceFromKakaoDocuments", () => {
  it("빈 목록이면 null이다", () => {
    expect(pickSchoolPlaceFromKakaoDocuments([])).toBeNull();
  });

  it("SC4 문서를 우선한다", () => {
    expect(
      pickSchoolPlaceFromKakaoDocuments([
        { x: "126.1", y: "37.1", category_group_code: "CE7" },
        { x: "126.9", y: "37.5", category_group_code: "SC4" },
      ])
    ).toEqual({ latitude: 37.5, longitude: 126.9 });
  });

  it("SC4가 없으면 첫 문서다", () => {
    expect(
      pickSchoolPlaceFromKakaoDocuments([{ x: "126.2", y: "37.2" }])
    ).toEqual({ latitude: 37.2, longitude: 126.2 });
  });

  it("좌표가 숫자가 아니면 null이다", () => {
    expect(
      pickSchoolPlaceFromKakaoDocuments([{ x: "a", y: "b" }])
    ).toBeNull();
  });
});
