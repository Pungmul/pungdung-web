import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../types";

import { mergeChatRoomListWithCache } from "./merge-chat-room-list-with-cache.service";

const room = (override: Partial<ChatRoomListItem>): ChatRoomListItem => ({
  chatRoomUUID: override.chatRoomUUID ?? "room-default",
  isMuted: override.isMuted ?? false,
  lastMessageTime: "2026-05-17T10:00:00.000Z",
  lastMessageContent: null,
  unreadCount: 0,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "room",
  profileImageUrl: null,
  group: false,
  ...override,
});

describe("mergeChatRoomListWithCache", () => {
  it("캐시 항목을 먼저 포함하고, 동일 roomId는 서버 응답으로 override한다", () => {
    const cached = [
      room({
        chatRoomUUID: "room-a",
        lastMessageTime: "2026-05-17T09:00:00.000Z",
        lastMessageContent: "cached-a",
      }),
      room({
        chatRoomUUID: "room-b",
        lastMessageTime: "2026-05-17T08:00:00.000Z",
        lastMessageContent: "cached-b",
      }),
    ];

    const queried = [
      room({
        chatRoomUUID: "room-b",
        lastMessageTime: "2026-05-17T11:00:00.000Z",
        lastMessageContent: "server-b",
      }),
      room({
        chatRoomUUID: "room-c",
        lastMessageTime: "2026-05-17T10:00:00.000Z",
        lastMessageContent: "server-c",
      }),
    ];

    const result = mergeChatRoomListWithCache(cached, queried);

    expect(result.map((item) => item.chatRoomUUID)).toEqual([
      "room-b",
      "room-c",
      "room-a",
    ]);
    expect(
      result.find((item) => item.chatRoomUUID === "room-b")?.lastMessageContent
    ).toBe("server-b");
  });

  it("server 목록이 비어도 캐시 목록을 시간순으로 반환한다", () => {
    const cached = [
      room({
        chatRoomUUID: "room-old",
        lastMessageTime: "2026-05-17T01:00:00.000Z",
      }),
      room({
        chatRoomUUID: "room-new",
        lastMessageTime: "2026-05-17T03:00:00.000Z",
      }),
    ];

    const result = mergeChatRoomListWithCache(cached, []);

    expect(result.map((item) => item.chatRoomUUID)).toEqual([
      "room-new",
      "room-old",
    ]);
  });
});
