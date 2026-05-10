import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../types";

import { resolveEntryUnreadCountHint } from "./resolve-entry-unread-count-hint.service";

const room = (unreadCount: number): ChatRoomListItem =>
  ({
    chatRoomUUID: "room-a",
    unreadCount,
  } as ChatRoomListItem);

describe("resolveEntryUnreadCountHint", () => {
  it("IDB와 room list unread 중 큰 값을 반환한다", () => {
    expect(resolveEntryUnreadCountHint(3, [room(7)], "room-a")).toBe(7);
    expect(resolveEntryUnreadCountHint(9, [room(2)], "room-a")).toBe(9);
    expect(resolveEntryUnreadCountHint(null, undefined, "room-a")).toBe(0);
  });
});
