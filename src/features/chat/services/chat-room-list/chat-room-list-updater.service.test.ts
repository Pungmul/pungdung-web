import { describe, expect, it } from "vitest";

import type { ChatRoomListItem } from "../../types/chat-room.types";

import { mergeRoomListSocketNotification } from "./merge-room-list-socket-notification.service";
import { removeChatRoomFromList } from "./remove-chat-room-from-list.service";
import { resetUnreadCountInRoomList } from "./reset-unread-count-in-room-list.service";
import { updateLastMessageInRoomList } from "./update-last-message-in-room-list.service";

const baseRoom = (id: string, unread: number | null = 1): ChatRoomListItem => ({
  chatRoomUUID: id,
  isMuted: false,
  lastMessageTime: "2026-01-01T12:00:00Z",
  lastMessageContent: "old",
  unreadCount: unread,
  senderId: 1,
  senderName: "a",
  receiverId: 2,
  receiverName: "b",
  chatRoomMemberIds: [1, 2],
  chatRoomMemberNames: ["a", "b"],
  roomName: "room",
  profileImageUrl: null,
  group: false,
});

describe("chat-room-list-updater.service", () => {
  describe("resetUnreadCount", () => {
    it("해당 방만 unreadCount를 0으로 만든다", () => {
      const rooms = [baseRoom("a", 3), baseRoom("b", 5)];
      const next = resetUnreadCountInRoomList(rooms, "a");
      expect(next.find((r) => r.chatRoomUUID === "a")?.unreadCount).toBe(0);
      expect(next.find((r) => r.chatRoomUUID === "b")?.unreadCount).toBe(5);
    });
  });

  describe("removeChatRoom", () => {
    it("해당 UUID 방을 제거한다", () => {
      const rooms = [baseRoom("a"), baseRoom("b")];
      expect(
        removeChatRoomFromList(rooms, "a").map((r) => r.chatRoomUUID)
      ).toEqual(["b"]);
    });
  });

  describe("updateLastMessage", () => {
    it("해당 방의 마지막 메시지 필드를 갱신한다", () => {
      const rooms = [baseRoom("x")];
      const next = updateLastMessageInRoomList(
        rooms,
        "x",
        "new body",
        "2026-02-01T00:00:00Z"
      );
      expect(next[0]?.lastMessageContent).toBe("new body");
      expect(next[0]?.lastMessageTime).toBe("2026-02-01T00:00:00Z");
    });
  });

  describe("mergeRoomListSocketNotification", () => {
    it("oldList가 없으면 noop", () => {
      const res = mergeRoomListSocketNotification(
        undefined,
        { chatRoomUUID: "x", type: "READ" },
        undefined
      );
      expect(res).toEqual({ kind: "noop" });
    });

    it("목록에 없는 방이면 invalidate", () => {
      const res = mergeRoomListSocketNotification(
        [baseRoom("a")],
        { chatRoomUUID: "missing", type: "READ" },
        undefined
      );
      expect(res).toEqual({ kind: "invalidate" });
    });

    it("READ면 해당 방 unread만 0으로", () => {
      const res = mergeRoomListSocketNotification(
        [baseRoom("a", 4), baseRoom("b", 2)],
        { chatRoomUUID: "a", type: "READ" },
        undefined
      );
      expect(res.kind).toBe("data");
      if (res.kind === "data") {
        expect(res.rooms.find((r) => r.chatRoomUUID === "a")?.unreadCount).toBe(
          0
        );
        expect(res.rooms.find((r) => r.chatRoomUUID === "b")?.unreadCount).toBe(
          2
        );
      }
    });

    it("포커스 중인 방이면 새 메시지에도 unread를 올리지 않는다", () => {
      const res = mergeRoomListSocketNotification(
        [baseRoom("a", 0)],
        {
          chatRoomUUID: "a",
          timestamp: "2026-03-01T00:00:00Z",
          content: "hi",
          type: "MESSAGE",
        },
        "a"
      );
      expect(res.kind).toBe("data");
      if (res.kind === "data") {
        expect(res.rooms.find((r) => r.chatRoomUUID === "a")?.unreadCount).toBe(
          0
        );
        expect(
          res.rooms.find((r) => r.chatRoomUUID === "a")?.lastMessageContent
        ).toBe("hi");
      }
    });

    it("포커스가 아니면 unread를 증가시키고 시간순 정렬한다", () => {
      const older = baseRoom("old", 1);
      older.lastMessageTime = "2026-01-01T00:00:00Z";
      const newer = baseRoom("new", 1);
      newer.lastMessageTime = "2026-01-02T00:00:00Z";
      const res = mergeRoomListSocketNotification(
        [older, newer],
        {
          chatRoomUUID: "old",
          timestamp: "2026-06-01T00:00:00Z",
          content: "ping",
        },
        "new"
      );
      expect(res.kind).toBe("data");
      if (res.kind === "data") {
        expect(res.rooms[0]?.chatRoomUUID).toBe("old");
        expect(
          res.rooms.find((r) => r.chatRoomUUID === "old")?.unreadCount
        ).toBe(2);
      }
    });
  });
});
