import { describe, expect, it } from "vitest";

import type { ChatRoom } from "../../types/chat-room.types";

import { resolveOwnLastReadMessageIdFromChatRoom } from "./resolve-own-last-read-message-id-from-chat-room.service";

const chatRoom = (overrides?: Partial<ChatRoom>): ChatRoom => ({
  chatRoomInfo: {
    chatRoomUUID: "room-1",
    roomName: "room",
    profileImageUrl: null,
    group: false,
  },
  userInfoList: [
    {
      userId: 1,
      username: "me",
      name: "me",
      profileImage: {
        id: 1,
        originalFilename: "a.jpg",
        convertedFileName: "a.jpg",
        fullFilePath: "https://example.com/1.jpg",
        fileType: "image/jpeg",
        fileSize: 1,
        createdAt: "2026-01-01",
      },
    },
    {
      userId: 2,
      username: "u2",
      name: "u2",
      profileImage: {
        id: 2,
        originalFilename: "b.jpg",
        convertedFileName: "b.jpg",
        fullFilePath: "https://example.com/2.jpg",
        fileType: "image/jpeg",
        fileSize: 1,
        createdAt: "2026-01-01",
      },
    },
  ],
  messageList: {
    list: [],
    hasMore: false,
    nextCursor: null,
  },
  userInitReadList: [
    { userId: 1, lastReadMessageId: 1133 },
    { userId: 2, lastReadMessageId: 1100 },
  ],
  ...overrides,
});

describe("resolveOwnLastReadMessageIdFromChatRoom", () => {
  it("username으로 userId를 찾아 userInitReadList의 lastReadMessageId를 반환한다", () => {
    expect(resolveOwnLastReadMessageIdFromChatRoom(chatRoom(), "me")).toBe(
      1133
    );
  });

  it("username이 없으면 null을 반환한다", () => {
    expect(
      resolveOwnLastReadMessageIdFromChatRoom(chatRoom(), "unknown")
    ).toBeNull();
  });
});
