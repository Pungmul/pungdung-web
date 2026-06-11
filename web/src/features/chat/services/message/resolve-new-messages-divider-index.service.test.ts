import { describe, expect, it } from "vitest";

import type { Message } from "../../types";

import { resolveNewMessagesDividerIndex } from "./resolve-new-messages-divider-index.service";
import { countUnreadMessagesAfterEntry } from "../chat-room/count-unread-messages-after-entry.service";

const message = (id: number): Message => ({
  id,
  senderUsername: "u1",
  content: "hello",
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room-1",
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("countUnreadMessagesAfterEntry", () => {
  it("entryLastReadMessageId 이후 메시지 개수를 센다", () => {
    const messages = [message(1), message(2), message(3)];

    expect(countUnreadMessagesAfterEntry(messages, 1)).toBe(2);
    expect(countUnreadMessagesAfterEntry(messages, 3)).toBe(0);
    expect(countUnreadMessagesAfterEntry(messages, null)).toBe(0);
  });
});

describe("resolveNewMessagesDividerIndex", () => {
  it("entryLastReadMessageId 이후 첫 메시지 인덱스를 반환한다", () => {
    const messages = [message(1), message(2), message(3)];

    expect(resolveNewMessagesDividerIndex(messages, 1)).toBe(1);
    expect(resolveNewMessagesDividerIndex(messages, 2)).toBe(2);
    expect(resolveNewMessagesDividerIndex(messages, 3)).toBeNull();
  });

  it("entryLastReadMessageId가 null이면 구분선을 표시하지 않는다", () => {
    expect(resolveNewMessagesDividerIndex([message(1)], null)).toBeNull();
  });

  it("minUnreadCount 미만이면 구분선을 표시하지 않는다", () => {
    const messages = Array.from({ length: 9 }, (_, index) =>
      message(index + 2)
    );

    expect(
      resolveNewMessagesDividerIndex(messages, 1, { minUnreadCount: 10 })
    ).toBeNull();
  });

  it("minUnreadCount 이상이면 구분선을 표시한다", () => {
    const messages = Array.from({ length: 10 }, (_, index) =>
      message(index + 2)
    );

    expect(
      resolveNewMessagesDividerIndex(messages, 1, { minUnreadCount: 10 })
    ).toBe(0);
  });
});
