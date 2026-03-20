import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../types/domain/chat-room.types";

import { sortChatRoomByDate } from "./sort-chat-room-by-date";

const room = (over: Partial<ChatRoomListItem>): ChatRoomListItem => ({
  chatRoomUUID: "r",
  isMuted: false,
  lastMessageTime: "2026-01-01T00:00:00Z",
  lastMessageContent: null,
  unreadCount: 0,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "n",
  profileImageUrl: null,
  group: false,
  ...over,
});

describe("sortChatRoomByDate", () => {
  it("lastMessageTime 기준 내림차순으로 정렬한다", () => {
    const a = room({
      chatRoomUUID: "old",
      lastMessageTime: "2026-01-01T10:00:00Z",
    });
    const b = room({
      chatRoomUUID: "new",
      lastMessageTime: "2026-01-02T10:00:00Z",
    });
    const sorted = sortChatRoomByDate([a, b]);
    expect(sorted.map((r) => r.chatRoomUUID)).toEqual(["new", "old"]);
  });

  it("원본 배열을 변이하지 않는다", () => {
    const input = [room({ chatRoomUUID: "1" }), room({ chatRoomUUID: "2" })];
    const copy = [...input];
    sortChatRoomByDate(input);
    expect(input).toEqual(copy);
  });
});
