import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../types";

import { patchUnreadCountResetInRoomList } from "./patch-unread-count-reset-in-room-list.service";

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {}
): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: 3,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "room",
  profileImageUrl: null,
  group: false,
  ...overrides,
});

describe("patchUnreadCountResetInRoomList", () => {
  it("해당 방만 unreadCount를 0으로 만든다", () => {
    const { next, changed } = patchUnreadCountResetInRoomList(
      [
        createRoom({ chatRoomUUID: "room-1", unreadCount: 3 }),
        createRoom({ chatRoomUUID: "room-2", unreadCount: 5 }),
      ],
      "room-1"
    );

    expect(changed).toBe(true);
    expect(next.find((room) => room.chatRoomUUID === "room-1")?.unreadCount).toBe(
      0
    );
    expect(next.find((room) => room.chatRoomUUID === "room-2")?.unreadCount).toBe(
      5
    );
  });

  it("이미 0이면 changed=false를 반환한다", () => {
    const { changed } = patchUnreadCountResetInRoomList(
      [createRoom({ chatRoomUUID: "room-1", unreadCount: 0 })],
      "room-1"
    );

    expect(changed).toBe(false);
  });
});
