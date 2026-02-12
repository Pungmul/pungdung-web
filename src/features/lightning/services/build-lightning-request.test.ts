import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LightningCreateFormData } from "../types/schemas";

import { buildLightningRequest } from "./build-lightning-request";

const baseForm = {
  title: "테스트 모임",
  minPersonnel: 4,
  maxPersonnel: 5,
  lightningType: "일반 모임",
  recruitEndTime: "14:30",
  address: "본관",
  detailAddress: "101호",
  locationPoint: { latitude: 37.5, longitude: 127.0 },
  target: "전체",
  tagList: ["태그1"],
} as LightningCreateFormData;

describe("buildLightningRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-26T10:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("일반 모임이면 meetingType FREE와 ALL visibility로 변환한다", () => {
    const result = buildLightningRequest({
      ...baseForm,
      lightningType: "일반 모임",
      target: "전체",
    });
    expect(result.meetingType).toBe("FREE");
    expect(result.visibilityScope).toBe("ALL");
    expect(result.meetingName).toBe("테스트 모임");
    expect(result.minPersonNum).toBe(4);
    expect(result.maxPersonNum).toBe(5);
    expect(result.latitude).toBe(37.5);
    expect(result.longitude).toBe(127);
    expect(result.tags).toEqual(["태그1"]);
  });

  it("풍물 모임이면 meetingType PAN으로 변환한다", () => {
    const result = buildLightningRequest({
      ...baseForm,
      lightningType: "풍물 모임",
    });
    expect(result.meetingType).toBe("PAN");
  });

  it("우리 학교만이면 visibilityScope SCHOOL_ONLY", () => {
    const result = buildLightningRequest({
      ...baseForm,
      target: "우리 학교만",
    });
    expect(result.visibilityScope).toBe("SCHOOL_ONLY");
  });

  it("locationPoint가 없으면 에러를 던진다", () => {
    expect(() =>
      buildLightningRequest({
        ...baseForm,
        locationPoint: null,
      })
    ).toThrow("위치 정보가 필요합니다");
  });
});
