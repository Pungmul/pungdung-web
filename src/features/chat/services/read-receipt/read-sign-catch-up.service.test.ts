import { describe, expect, it } from "vitest";

import { mergeReadTargetMessageId } from "./merge-read-target-message-id.service";
import { resolveConfirmedLastReadMessageId } from "./resolve-confirmed-last-read-message-id.service";
import { shouldClearReadSignTarget } from "./should-clear-read-sign-target.service";
import { shouldScheduleReadSignCatchUp } from "./should-schedule-read-sign-catch-up.service";

const TEST_MY_USER_ID = 3;
const OLDER_MESSAGE_ID = 1032;
const NEWER_MESSAGE_ID = 1034;

describe("read-sign-catch-up.service", () => {
  it("mergeReadTargetMessageId는 더 큰 id를 유지한다", () => {
    expect(mergeReadTargetMessageId(null, NEWER_MESSAGE_ID)).toBe(NEWER_MESSAGE_ID);
    expect(mergeReadTargetMessageId(OLDER_MESSAGE_ID, NEWER_MESSAGE_ID)).toBe(
      NEWER_MESSAGE_ID
    );
  });

  it("resolveConfirmedLastReadMessageId는 messageIds가 있을 때만 값을 반환한다", () => {
    expect(resolveConfirmedLastReadMessageId([])).toBeNull();
    expect(
      resolveConfirmedLastReadMessageId([OLDER_MESSAGE_ID, NEWER_MESSAGE_ID])
    ).toBe(NEWER_MESSAGE_ID);
  });

  it("shouldClearReadSignTarget은 서버 확정 id가 있을 때만 true", () => {
    expect(shouldClearReadSignTarget(NEWER_MESSAGE_ID, NEWER_MESSAGE_ID)).toBe(
      true
    );
    expect(shouldClearReadSignTarget(NEWER_MESSAGE_ID, null)).toBe(false);
    expect(shouldClearReadSignTarget(NEWER_MESSAGE_ID, OLDER_MESSAGE_ID)).toBe(
      false
    );
  });

  it("shouldScheduleReadSignCatchUp은 내 읽음인데 messageIds가 비면 true", () => {
    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: TEST_MY_USER_ID,
        myUserId: TEST_MY_USER_ID,
        targetMessageId: NEWER_MESSAGE_ID,
        messageIds: [],
        confirmedLastReadMessageId: null,
      })
    ).toBe(true);
  });

  it("shouldScheduleReadSignCatchUp은 서버 확정이 목표보다 낮으면 true", () => {
    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: TEST_MY_USER_ID,
        myUserId: TEST_MY_USER_ID,
        targetMessageId: NEWER_MESSAGE_ID,
        messageIds: [OLDER_MESSAGE_ID],
        confirmedLastReadMessageId: OLDER_MESSAGE_ID,
      })
    ).toBe(true);

    expect(
      shouldScheduleReadSignCatchUp({
        broadcastUserId: TEST_MY_USER_ID,
        myUserId: TEST_MY_USER_ID,
        targetMessageId: NEWER_MESSAGE_ID,
        messageIds: [NEWER_MESSAGE_ID],
        confirmedLastReadMessageId: NEWER_MESSAGE_ID,
      })
    ).toBe(false);
  });
});
