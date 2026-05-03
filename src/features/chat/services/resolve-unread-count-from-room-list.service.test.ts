import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../types";

import { resolveUnreadCountFromRoomList } from "./resolve-unread-count-from-room-list.service";

const room = (id: string, unreadCount: number | null): ChatRoomListItem => ({
  chatRoomUUID: id,
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: id,
  profileImageUrl: null,
  group: false,
});

describe("resolveUnreadCountFromRoomList", () => {
  it("roomId에 해당하는 unreadCount를 반환한다", () => {
    const rooms = [room("room-a", 12), room("room-b", 3)];

    expect(resolveUnreadCountFromRoomList(rooms, "room-a")).toBe(12);
    expect(resolveUnreadCountFromRoomList(rooms, "room-b")).toBe(3);
  });

  it("방이 없으면 null을 반환한다", () => {
    expect(resolveUnreadCountFromRoomList([room("room-a", 1)], "room-x")).toBe(
      null
    );
    expect(resolveUnreadCountFromRoomList(undefined, "room-a")).toBeNull();
  });
});
