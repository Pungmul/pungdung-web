import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../../types";

import { mapChatRoomListItemIndexedDBToDomain } from "../../indexed-db/mappers/map-chat-room-list-item-indexed-db-to-domain.mapper";

const roomBase: Omit<ChatRoomListItem, "isMuted"> = {
  chatRoomUUID: "room-1",
  lastMessageTime: "2026-05-17T10:00:00.000Z",
  lastMessageContent: "hello",
  unreadCount: 2,
  senderId: 1,
  senderName: "sender",
  receiverId: 2,
  receiverName: "receiver",
  chatRoomMemberIds: [1, 2],
  chatRoomMemberNames: ["sender", "receiver"],
  roomName: "room",
  profileImageUrl: null,
  group: false,
  type: "NORMAL",
  relatedId: null,
};

describe("mapChatRoomListItemIndexedDBToDomain", () => {
  it("isMuted가 있으면 해당 값을 사용한다", () => {
    const result = mapChatRoomListItemIndexedDBToDomain({
      ...roomBase,
      isMuted: false,
      muted: true,
    });

    expect(result.isMuted).toBe(false);
  });

  it("isMuted가 없으면 legacy muted 값을 사용한다", () => {
    const result = mapChatRoomListItemIndexedDBToDomain({
      ...roomBase,
      muted: true,
    });

    expect(result.isMuted).toBe(true);
  });

  it("type과 relatedId가 없으면 NORMAL과 null로 둔다", () => {
    const { type: _type, relatedId: _relatedId, ...legacy } = roomBase;
    const result = mapChatRoomListItemIndexedDBToDomain({
      ...legacy,
      isMuted: false,
    });

    expect(result.type).toBe("NORMAL");
    expect(result.relatedId).toBeNull();
  });
});
