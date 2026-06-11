import { describe, expect, it } from "vitest";

import { resolveLastReadMessageIdFromReadAt } from "./resolve-last-read-message-id-from-read-at.service";

describe("resolveLastReadMessageIdFromReadAt", () => {
  const messages = [
    { id: 10, createdAt: "2026-06-12T19:00:00.000Z" },
    { id: 15, createdAt: "2026-06-12T19:04:00.000Z" },
    { id: 20, createdAt: "2026-06-12T19:05:00.000Z" },
  ];

  it("Java 나노초 readAt도 해석한다", () => {
    expect(
      resolveLastReadMessageIdFromReadAt(
        "2026-06-12T19:04:12.508783911",
        messages
      )
    ).toBe(15);
  });

  it("readAt 이후 메시지는 제외하고 마지막 읽음 id를 반환한다", () => {
    expect(
      resolveLastReadMessageIdFromReadAt(
        "2026-06-12T19:04:12.508Z",
        messages
      )
    ).toBe(15);
  });

  it("readAt이 모든 메시지 이후면 최신 id", () => {
    expect(
      resolveLastReadMessageIdFromReadAt(
        "2026-06-12T19:10:00.000Z",
        messages
      )
    ).toBe(20);
  });

  it("메시지가 없으면 null", () => {
    expect(
      resolveLastReadMessageIdFromReadAt("2026-06-12T19:04:12.508Z", [])
    ).toBeNull();
  });
});
