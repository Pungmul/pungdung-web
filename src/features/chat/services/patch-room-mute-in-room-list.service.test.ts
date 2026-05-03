import { describe, expect, it, vi } from "vitest";

import * as chatLib from "../lib";
import type { ChatRoomListItem } from "../types";

import {
  patchRoomMuteInRoomList,
  patchRoomMuteInRoomListIndexedDB,
} from "./patch-room-mute-in-room-list.service";

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {}
): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: null,
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

describe("patchRoomMuteInRoomList", () => {
  it("대상 방의 isMuted만 갱신한다", () => {
    const { next, changed } = patchRoomMuteInRoomList(
      [
        createRoom({ chatRoomUUID: "room-1", isMuted: false }),
        createRoom({ chatRoomUUID: "room-2", isMuted: true }),
      ],
      "room-1",
      true
    );

    expect(changed).toBe(true);
    expect(next.find((room) => room.chatRoomUUID === "room-1")?.isMuted).toBe(
      true
    );
    expect(next.find((room) => room.chatRoomUUID === "room-2")?.isMuted).toBe(
      true
    );
  });

  it("변경이 없으면 changed=false를 반환한다", () => {
    const { changed } = patchRoomMuteInRoomList(
      [createRoom({ chatRoomUUID: "room-1", isMuted: true })],
      "room-1",
      true
    );

    expect(changed).toBe(false);
  });
});

describe("patchRoomMuteInRoomListIndexedDB", () => {
  it("indexedDB room list의 isMuted를 갱신한다", async () => {
    vi.spyOn(chatLib, "getChatRoomListCache").mockResolvedValue({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: "room-1", isMuted: false })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
    const setCacheSpy = vi
      .spyOn(chatLib, "setChatRoomListCache")
      .mockResolvedValue(undefined);

    await patchRoomMuteInRoomListIndexedDB("room-1", true);

    expect(setCacheSpy).toHaveBeenCalledWith({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: "room-1", isMuted: true })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
  });
});
