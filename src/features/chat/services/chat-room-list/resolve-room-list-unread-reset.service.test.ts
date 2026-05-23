import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../types/chat-room.types";

import { resolveRoomListUnreadResetCachePlan } from "./resolve-room-list-unread-reset.service";

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

describe("resolveRoomListUnreadResetCachePlan", () => {
  it("캐시가 없으면 skip", () => {
    expect(resolveRoomListUnreadResetCachePlan(undefined, "room-1")).toEqual({
      kind: "skip",
    });
  });

  it("목록에 없는 방이면 invalidate", () => {
    expect(
      resolveRoomListUnreadResetCachePlan(
        [createRoom({ chatRoomUUID: "room-2" })],
        "room-1"
      )
    ).toEqual({ kind: "invalidate" });
  });

  it("대상 방 unreadCount만 0으로 patch", () => {
    const plan = resolveRoomListUnreadResetCachePlan(
      [
        createRoom({ chatRoomUUID: "room-1", unreadCount: 4 }),
        createRoom({ chatRoomUUID: "room-2", unreadCount: 2 }),
      ],
      "room-1"
    );

    expect(plan).toEqual({
      kind: "patch",
      changed: true,
      next: [
        createRoom({ chatRoomUUID: "room-1", unreadCount: 0 }),
        createRoom({ chatRoomUUID: "room-2", unreadCount: 2 }),
      ],
    });
  });

  it("이미 0이면 changed=false", () => {
    const rooms = [createRoom({ chatRoomUUID: "room-1", unreadCount: 0 })];
    const plan = resolveRoomListUnreadResetCachePlan(rooms, "room-1");

    expect(plan).toEqual({
      kind: "patch",
      changed: false,
      next: rooms,
    });
  });
});
