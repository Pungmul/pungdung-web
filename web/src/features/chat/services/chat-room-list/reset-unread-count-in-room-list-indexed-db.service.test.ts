import { afterEach, describe, expect, it, vi } from "vitest";

import * as chatLib from "../../lib";
import type { ChatRoomListItem } from "../../types";

import { resetUnreadCountInRoomListIndexedDB } from "./reset-unread-count-in-room-list-indexed-db.service";

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

describe("resetUnreadCountInRoomListIndexedDB", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("indexedDB room list의 unreadCount를 0으로 갱신한다", async () => {
    vi.spyOn(chatLib, "getChatRoomListCache").mockResolvedValue({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: "room-1", unreadCount: 4 })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
    const setCacheSpy = vi
      .spyOn(chatLib, "setChatRoomListCache")
      .mockResolvedValue(undefined);

    await resetUnreadCountInRoomListIndexedDB("room-1");

    expect(setCacheSpy).toHaveBeenCalledWith({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: "room-1", unreadCount: 0 })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
  });

  it("캐시가 없으면 setChatRoomListCache를 호출하지 않는다", async () => {
    vi.spyOn(chatLib, "getChatRoomListCache").mockResolvedValue(undefined);
    const setCacheSpy = vi
      .spyOn(chatLib, "setChatRoomListCache")
      .mockResolvedValue(undefined);

    await resetUnreadCountInRoomListIndexedDB("room-1");

    expect(setCacheSpy).not.toHaveBeenCalled();
  });

  it("이미 unreadCount가 0이면 setChatRoomListCache를 호출하지 않는다", async () => {
    vi.spyOn(chatLib, "getChatRoomListCache").mockResolvedValue({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: "room-1", unreadCount: 0 })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
    const setCacheSpy = vi
      .spyOn(chatLib, "setChatRoomListCache")
      .mockResolvedValue(undefined);

    await resetUnreadCountInRoomListIndexedDB("room-1");

    expect(setCacheSpy).not.toHaveBeenCalled();
  });
});
