import { describe, expect, it } from "vitest";

import { formatNotificationReceivedAt } from "./format-notification-received-at";

const now = new Date("2026-09-29T03:00:00.000Z");

describe("formatNotificationReceivedAt", () => {
  it("같은 날 1시간 안이면 분 단위로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2026-09-29T02:58:00.000Z"), now)
    ).toBe("2분전");
  });

  it("같은 날 1분 안이면 방금으로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2026-09-29T02:59:30.000Z"), now)
    ).toBe("방금");
  });

  it("같은 날 1시간 이상이면 시간 단위로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2026-09-29T01:00:00.000Z"), now)
    ).toBe("2시간전");
  });

  it("UTC로는 전날이어도 서울 기준 같은 날이면 시간 단위로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2026-09-28T15:30:00.000Z"), now)
    ).toBe("11시간전");
  });

  it("올해의 다른 날이면 월일로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2026-09-07T00:00:00.000Z"), now)
    ).toBe("9월 7일");
  });

  it("해가 다르면 연월일로 보여야 한다", () => {
    expect(
      formatNotificationReceivedAt(new Date("2025-10-31T00:00:00.000Z"), now)
    ).toBe("2025년 10월 31일");
  });

  it("잘못된 시각이면 빈 문자열을 반환해야 한다", () => {
    expect(formatNotificationReceivedAt(new Date("not-a-date"), now)).toBe("");
    expect(formatNotificationReceivedAt(new Date(0), now)).toBe("");
  });
});
