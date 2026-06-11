import { describe, expect, it } from "vitest";

import { getTimeSincePosted } from "./parseDateString";

describe("getTimeSincePosted", () => {
  const now = new Date("2024-06-15T12:00:00.000Z");

  it("172분 경과 시 분 수와 'N시간 전' 문구를 반환한다", () => {
    const created = new Date(now.getTime() - 172 * 60 * 1000);
    expect(getTimeSincePosted(created, now)).toEqual({
      timeSincePosted: 172,
      timeSincePostedText: "2시간 전",
    });
  });

  it("1분 미만이면 방금다", () => {
    const created = new Date(now.getTime() - 30 * 1000);
    expect(getTimeSincePosted(created, now)).toEqual({
      timeSincePosted: 0,
      timeSincePostedText: "방금",
    });
  });

  it("파싱 불가 문자열이면 빈 문구", () => {
    expect(getTimeSincePosted("invalid", now)).toEqual({
      timeSincePosted: 0,
      timeSincePostedText: "",
    });
  });

  it("7일 이상이면 서울 기준 짧은 날짜", () => {
    const created = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const r = getTimeSincePosted(created, now);
    expect(r.timeSincePostedText).toMatch(/^\d{2}\.\d{2}$/);
  });
});
