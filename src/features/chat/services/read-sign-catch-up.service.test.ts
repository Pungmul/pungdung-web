import { describe, expect, it } from "vitest";

import { mergeReadTargetMessageId } from "./merge-read-target-message-id.service";
import { resolveConfirmedLastReadMessageId } from "./resolve-confirmed-last-read-message-id.service";
import { shouldClearReadSignTarget } from "./should-clear-read-sign-target.service";
import { shouldScheduleReadSignCatchUp } from "./should-schedule-read-sign-catch-up.service";

describe("read-sign-catch-up.service", () => {
  it("mergeReadTargetMessageId는 더 큰 id를 유지한다", () => {
    expect(mergeReadTargetMessageId(null, 1034)).toBe(1034);
    expect(mergeReadTargetMessageId(1032, 1034)).toBe(1034);
  });

  it("resolveConfirmedLastReadMessageId는 messageIds가 있을 때만 값을 반환한다", () => {
    expect(resolveConfirmedLastReadMessageId([])).toBeNull();
    expect(resolveConfirmedLastReadMessageId([1032, 1034])).toBe(1034);
  });

  it("shouldClearReadSignTarget은 서버 확정 id가 있을 때만 true", () => {
    expect(shouldClearReadSignTarget(1034, 1034)).toBe(true);
    expect(shouldClearReadSignTarget(1034, null)).toBe(false);
    expect(shouldClearReadSignTarget(1034, 1032)).toBe(false);
  });

  it("shouldScheduleReadSignCatchUp은 내 읽음인데 messageIds가 비면 true", () => {
    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: 3,
        myUserId: 3,
        targetMessageId: 1034,
        messageIds: [],
        confirmedLastReadMessageId: null,
      })
    ).toBe(true);
  });

  it("shouldScheduleReadSignCatchUp은 서버 확정이 목표보다 낮으면 true", () => {
    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: 3,
        myUserId: 3,
        targetMessageId: 1034,
        messageIds: [1032],
        confirmedLastReadMessageId: 1032,
      })
    ).toBe(true);

    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: 3,
        myUserId: 3,
        targetMessageId: 1034,
        messageIds: [1034],
        confirmedLastReadMessageId: 1034,
      })
    ).toBe(false);
  });
});
