import { describe, expect, it } from "vitest";

import { resolveLastReadMessageIdFromReadBroadcast } from "./resolve-last-read-message-id-from-read-broadcast.service";

describe("resolveLastReadMessageIdFromReadBroadcast", () => {
  const timelineMessages = [
    { id: 1590, createdAt: "2026-06-12T19:00:00.000Z" },
    { id: 1593, createdAt: "2026-06-12T19:04:00.000Z" },
  ];

  it("messageIds가 있으면 max를 우선한다", () => {
    expect(
      resolveLastReadMessageIdFromReadBroadcast({
        messageIds: [100, 105],
      })
    ).toBe(105);
  });

  it("messageIds가 비어 있으면 readAt+타임라인으로 해석한다", () => {
    expect(
      resolveLastReadMessageIdFromReadBroadcast({
        messageIds: [],
        readAt: "2026-06-12T19:04:12.508783911",
        timelineMessages,
      })
    ).toBe(1593);
  });

  it("messageIds·readAt가 없으면 fallbackLastReadMessageId를 쓴다", () => {
    expect(
      resolveLastReadMessageIdFromReadBroadcast({
        messageIds: [],
        fallbackLastReadMessageId: 1569,
      })
    ).toBe(1569);
  });

  it("확정 값이 없으면 null", () => {
    expect(
      resolveLastReadMessageIdFromReadBroadcast({
        messageIds: [],
        fallbackLastReadMessageId: null,
      })
    ).toBeNull();
  });
});
