import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { lightningBuildSchema } from "./lightning-create.schemas";

const validBase = {
  title: "제목",
  minPersonnel: 4,
  maxPersonnel: 5,
  lightningType: "일반 모임" as const,
  recruitEndTime: "14:30",
  startTime: "19:00",
  isStartTimeUndecided: false,
  address: "주소",
  detailAddress: "",
  locationPoint: { latitude: 1, longitude: 2 },
  target: "전체" as const,
  tagList: [],
};

describe("lightningBuildSchema", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-26T10:00:00+09:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("유효한 입력을 통과시킨다", () => {
    const parsed = lightningBuildSchema.safeParse(validBase);
    expect(parsed.success).toBe(true);
  });

  it("최소 인원이 최대 인원보다 크면 실패한다", () => {
    const parsed = lightningBuildSchema.safeParse({
      ...validBase,
      minPersonnel: 6,
      maxPersonnel: 5,
    });
    expect(parsed.success).toBe(false);
  });

  it("시작 시간 미정이면 startTime이 비어도 통과한다", () => {
    const parsed = lightningBuildSchema.safeParse({
      ...validBase,
      startTime: "",
      isStartTimeUndecided: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("모집 마감이 시작 시간보다 늦으면 실패한다", () => {
    const parsed = lightningBuildSchema.safeParse({
      ...validBase,
      recruitEndTime: "20:00",
      startTime: "19:00",
    });
    expect(parsed.success).toBe(false);
  });

  it("위치 정보가 없으면 실패한다", () => {
    const parsed = lightningBuildSchema.safeParse({
      ...validBase,
      locationPoint: null,
    });
    expect(parsed.success).toBe(false);
  });
});
