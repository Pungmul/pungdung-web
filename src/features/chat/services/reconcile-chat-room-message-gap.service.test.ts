import { describe, expect, it } from "vitest";

import { IMAGE_LAST_MESSAGE_PREVIEW } from "../lib/image-last-message-preview";
import type { ChatRoomListItem, Message } from "../types";

import { applyChatRoomGapMessagesToRoomList } from "./apply-chat-room-gap-messages-to-room-list.service";
import { resolveNewestGapMessagePreview } from "./resolve-newest-gap-message-preview.service";

const text = (id: number, createdAt: string): Message =>
  ({
    id,
    senderUsername: "u",
    content: `msg-${id}`,
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "room-1",
    createdAt,
  } as Message);

const roomListItem = (): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: "2026-01-01T00:00:00Z",
  lastMessageContent: "old",
  unreadCount: 1,
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

describe("resolveNewestGapMessagePreview", () => {
  it("가장 최신 gap 메시지 미리보기를 반환한다", () => {
    expect(
      resolveNewestGapMessagePreview([
        text(100, "2026-01-01T00:00:00Z"),
        text(102, "2026-01-01T00:00:02Z"),
      ])
    ).toEqual({
      content: "msg-102",
      createdAt: "2026-01-01T00:00:02Z",
    });
  });

  it("이미지 메시지는 목록 미리보기 문구로 변환한다", () => {
    expect(
      resolveNewestGapMessagePreview([
        {
          id: 10,
          senderUsername: "u",
          content: null,
          chatType: "IMAGE",
          imageUrlList: ["https://example.com/a.png"],
          chatRoomUUID: "room-1",
          createdAt: "2026-01-01T00:00:10Z",
        },
      ])
    ).toEqual({
      content: IMAGE_LAST_MESSAGE_PREVIEW,
      createdAt: "2026-01-01T00:00:10Z",
    });
  });
});

describe("applyChatRoomGapMessagesToRoomList", () => {
  it("gap 메시지의 최신 미리보기를 room list에 반영한다", () => {
    const next = applyChatRoomGapMessagesToRoomList(
      [roomListItem()],
      "room-1",
      [text(101, "2026-01-01T00:00:01Z")]
    );

    expect(next?.[0]?.lastMessageContent).toBe("msg-101");
    expect(next?.[0]?.lastMessageTime).toBe("2026-01-01T00:00:01Z");
  });

  it("gap이 없으면 이전 스냅샷을 그대로 반환한다", () => {
    const prev = [roomListItem()];
    expect(applyChatRoomGapMessagesToRoomList(prev, "room-1", [])).toBe(prev);
  });
});
