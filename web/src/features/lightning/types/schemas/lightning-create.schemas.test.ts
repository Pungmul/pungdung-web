import { describe, expect, it } from "vitest";

import { lightningBuildSchema } from "./lightning-create.schemas";

const validBase = {
  title: "제목",
  minPersonnel: 4,
  maxPersonnel: 5,
  lightningType: "일반 모임" as const,
  recruitEndTime: "14:30",
  address: "주소",
  detailAddress: "",
  locationPoint: { latitude: 1, longitude: 2 },
  target: "전체" as const,
  tagList: [],
};

describe("lightningBuildSchema", () => {
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

  it("위치 정보가 없으면 실패한다", () => {
    const parsed = lightningBuildSchema.safeParse({
      ...validBase,
      locationPoint: null,
    });
    expect(parsed.success).toBe(false);
  });
});
