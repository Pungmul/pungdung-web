import type { InfiniteData } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import type { ChatLogCursorPage, ChatRoom, Message } from "../../types";

import { applyChatRoomGapMessagesToChatRoom } from "./apply-chat-room-gap-messages-to-chat-room.service";
import { applyChatRoomGapMessagesToRoomInfinite } from "./apply-chat-room-gap-messages-to-room-infinite.service";
import { mergeChatMessagesNewestFirst } from "../../lib/message/merge-chat-messages-newest-first";

const text = (
  id: number,
  override: Partial<Extract<Message, { chatType: "TEXT" }>> = {}
): Message => ({
  id,
  senderUsername: "u",
  content: "c",
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room-1",
  createdAt: `2026-01-01T00:00:${String(id).padStart(2, "0")}Z`,
  ...override,
});

const room = (messages: Message[]): ChatRoom => ({
  chatRoomInfo: {
    chatRoomUUID: "room-1",
    roomName: "방",
    profileImageUrl: null,
    group: false,
  },
  userInfoList: [],
  messageList: {
    list: messages,
    hasMore: false,
    nextCursor: null,
  },
  userInitReadList: [],
});

describe("mergeChatMessagesNewestFirst", () => {
  it("id 기준 최신순으로 정렬하고 중복 id는 incoming이 이긴다", () => {
    const existing = [text(100), text(98)];
    const incoming = [text(100, { content: "updated" }), text(101)];

    const merged = mergeChatMessagesNewestFirst(existing, incoming);

    expect(merged.map((message) => message.id)).toEqual([101, 100, 98]);
    expect(merged.find((message) => message.id === 100)?.content).toBe(
      "updated"
    );
  });

  it("비숫자 id가 섞이면 createdAt 기준이며 invalid createdAt은 String(id) fallback이다", () => {
    const existing = [
      text(100, { createdAt: "2026-01-01T00:00:30.000Z" }),
      text(99, { createdAt: "2026-01-01T00:00:01.000Z" }),
    ];
    const incoming = [
      text(1, {
        id: "pending-b",
        createdAt: "2026-01-01T00:00:10.000Z",
      }),
      text(1, {
        id: "pending-a",
        createdAt: "invalid-date",
      }),
      text(1, {
        id: "pending-c",
        createdAt: "invalid-date",
      }),
    ];

    const merged = mergeChatMessagesNewestFirst(existing, incoming);

    expect(merged.map((message) => String(message.id))).toEqual([
      "pending-c",
      "100",
      "pending-b",
      "pending-a",
      "99",
    ]);
  });
});

describe("applyChatRoomGapMessagesToChatRoom", () => {
  it("gap 메시지를 room messageList에 merge한다", () => {
    const prev = room([text(100), text(99)]);
    const next = applyChatRoomGapMessagesToChatRoom(prev, [text(101)]);

    expect(next?.messageList.list.map((message) => message.id)).toEqual([
      101, 100, 99,
    ]);
  });

  it("prev가 없거나 gap이 비어 있으면 prev를 그대로 반환한다", () => {
    const prev = room([text(100)]);
    expect(applyChatRoomGapMessagesToChatRoom(prev, [])).toBe(prev);
    expect(
      applyChatRoomGapMessagesToChatRoom(undefined, [text(101)])
    ).toBeUndefined();
  });
});

describe("applyChatRoomGapMessagesToRoomInfinite", () => {
  it("infinite 데이터가 없으면 gap으로 첫 페이지를 만든다", () => {
    const next = applyChatRoomGapMessagesToRoomInfinite(undefined, [
      text(101),
      text(100),
    ]);

    expect(next.pages[0]?.messages.map((message) => message.id)).toEqual([
      101, 100,
    ]);
    expect(next.pageParams).toEqual([undefined]);
  });

  it("첫 페이지에 gap 메시지를 merge한다", () => {
    const prev: InfiniteData<ChatLogCursorPage> = {
      pages: [
        {
          messages: [text(100), text(99)],
          hasMore: true,
          nextCursor: 99,
        },
        {
          messages: [text(80)],
          hasMore: false,
          nextCursor: null,
        },
      ],
      pageParams: [undefined, 99],
    };

    const next = applyChatRoomGapMessagesToRoomInfinite(prev, [text(101)]);

    expect(next.pages[0]?.messages.map((message) => message.id)).toEqual([
      101, 100, 99,
    ]);
    expect(next.pages[1]?.messages.map((message) => message.id)).toEqual([80]);
  });

  it("gap이 비어 있으면 prev를 유지한다", () => {
    const prev: InfiniteData<ChatLogCursorPage> = {
      pages: [{ messages: [text(100)], hasMore: false, nextCursor: null }],
      pageParams: [undefined],
    };

    expect(applyChatRoomGapMessagesToRoomInfinite(prev, [])).toBe(prev);
  });
});
