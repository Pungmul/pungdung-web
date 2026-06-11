import { describe, expect, it } from "vitest";

import {
  resolveMyReadBroadcastAction,
  resolveReadBroadcastLastReadMessageId,
} from "./resolve-read-sign-broadcast-action.service";

describe("resolveReadBroadcastLastReadMessageId", () => {
  it("내 브로드캐스트는 targetMessageId를 fallback으로 쓴다", () => {
    expect(
      resolveReadBroadcastLastReadMessageId({
        messageIds: [],
        readAt: "2026-06-12T19:04:12.508Z",
        runtime: { myUserId: 3, targetMessageId: 1593, catchUpAttempts: 0 },
        isMyReadBroadcast: true,
      })
    ).toBe(1593);
  });
});

describe("resolveMyReadBroadcastAction", () => {
  const runtime = {
    myUserId: 3,
    targetMessageId: 1593,
    catchUpAttempts: 0,
  };

  it("확정 read가 target 이상이면 clear_target", () => {
    expect(
      resolveMyReadBroadcastAction({
        runtime,
        broadcastUserId: 3,
        messageIds: [1593],
        resolvedLastReadMessageId: 1593,
      })
    ).toEqual({ type: "clear_target" });
  });

  it("messageIds가 비어 있고 확정 read가 target 미만이면 schedule_catch_up", () => {
    expect(
      resolveMyReadBroadcastAction({
        runtime: { ...runtime, targetMessageId: 1600 },
        broadcastUserId: 3,
        messageIds: [],
        resolvedLastReadMessageId: null,
      })
    ).toEqual({ type: "schedule_catch_up" });
  });
});
