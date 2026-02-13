import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildLightningSummaryDisplay } from "./build-lightning-summary-display";

type Watched = Parameters<typeof buildLightningSummaryDisplay>[0];

const emptyWatched: Watched = {
  lightningType: undefined,
  address: undefined,
  recruitEndTime: undefined,
  target: undefined,
};

describe("buildLightningSummaryDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-28T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("lightningType이 없으면 lightningType 기본 문구는 '유형'이다", () => {
    const result = buildLightningSummaryDisplay(emptyWatched);
    expect(result.lightningType).toBe("유형");
  });

  it("lightningType이 있으면 앞 두 글자만 사용한다", () => {
    const watched: Watched = {
      ...emptyWatched,
      lightningType: "일반 모임",
      address: "서울시",
      recruitEndTime: "14:30",
      target: "전체",
    };
    const result = buildLightningSummaryDisplay(watched);
    expect(result.lightningType).toBe("일반");
  });

  it("address가 없으면 location은 '내가 정한 위치'이다", () => {
    const result = buildLightningSummaryDisplay(emptyWatched);
    expect(result.location).toBe("내가 정한 위치");
  });

  it("address가 있으면 그대로 location에 쓴다", () => {
    const watched: Watched = { ...emptyWatched, address: "서울시" };
    const result = buildLightningSummaryDisplay(watched);
    expect(result.location).toBe("서울시");
  });

  it("recruitEndTime이 없으면 현재+5분을 HH:mm으로 넣는다", () => {
    const result = buildLightningSummaryDisplay(emptyWatched);
    const expected = dayjs().add(5, "minute").format("HH:mm");
    expect(result.time).toBe(expected);
  });

  it("recruitEndTime이 있으면 그대로 time에 쓴다", () => {
    const watched: Watched = { ...emptyWatched, recruitEndTime: "14:30" };
    const result = buildLightningSummaryDisplay(watched);
    expect(result.time).toBe("14:30");
  });

  it("target이 없으면 '전체'이다", () => {
    const result = buildLightningSummaryDisplay(emptyWatched);
    expect(result.target).toBe("전체");
  });

  it("target이 있으면 그대로 쓴다", () => {
    const watched: Watched = { ...emptyWatched, target: "우리 학교만" };
    const result = buildLightningSummaryDisplay(watched);
    expect(result.target).toBe("우리 학교만");
  });
});
