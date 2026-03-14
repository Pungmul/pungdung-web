import { describe, expect, it } from "vitest";

import type { ReadSocketMessage } from "../socket/socket-message.schema";
import type { ChatRoom } from "../types/domain/chat-room.types";

import { mergeChatRoomWithReadSocketMessage } from "./merge-chat-room-with-read-socket-message.service";

const textMsg = (id: number) =>
  ({
    id,
    senderUsername: "u",
    content: "x",
    chatType: "TEXT" as const,
    imageUrlList: null,
    chatRoomUUID: "r",
    createdAt: "2026-01-01",
  }) as const;

const minimalChatRoom = (list: ReturnType<typeof textMsg>[]): ChatRoom => ({
  chatRoomInfo: {
    chatRoomUUID: "r",
    roomName: "방",
    profileImageUrl: null,
    group: false,
  },
  userInfoList: [],
  messageList: {
    total: list.length,
    list: [...list],
    pageNum: 1,
    pageSize: 20,
    size: list.length,
    startRow: 1,
    endRow: list.length,
    pages: 1,
    prePage: 0,
    nextPage: 0,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
    navigatePages: 8,
    navigatepageNums: [1],
    navigateFirstPage: 1,
    navigateLastPage: 1,
  },
  userInitReadList: [
    { userId: 10, lastReadMessageId: 1 },
    { userId: 20, lastReadMessageId: 2 },
  ],
});

const readPayload = (
  userId: number,
  messageIds: number[]
): ReadSocketMessage => ({
  messageLogId: 1,
  domainType: "CHAT",
  businessIdentifier: "b",
  identifier: "i",
  stompDest: "d",
  content: {
    userId,
    messageIds,
    readAt: "2026-01-01",
  },
});

describe("mergeChatRoomWithReadSocketMessage", () => {
  it("prev가 없으면 undefined", () => {
    expect(
      mergeChatRoomWithReadSocketMessage(undefined, readPayload(10, [5]))
    ).toBeUndefined();
  });

  it("messageIds가 있으면 그 중 최대값으로 해당 유저 lastRead를 갱신한다", () => {
    const prev = minimalChatRoom([textMsg(3), textMsg(7), textMsg(9)]);
    const next = mergeChatRoomWithReadSocketMessage(prev, readPayload(10, [5, 8]));
    expect(next).toBeDefined();
    expect(next?.userInitReadList.find((u) => u.userId === 10)?.lastReadMessageId).toBe(
      8
    );
    expect(next?.userInitReadList.find((u) => u.userId === 20)?.lastReadMessageId).toBe(
      2
    );
  });

  it("messageIds가 비어 있으면 마지막 메시지 숫자 id를 사용한다", () => {
    const prev = minimalChatRoom([textMsg(100), textMsg(200)]);
    const next = mergeChatRoomWithReadSocketMessage(prev, readPayload(20, []));
    expect(next?.userInitReadList.find((u) => u.userId === 20)?.lastReadMessageId).toBe(
      200
    );
  });

  it("messageIds가 비었고 마지막 id가 숫자가 아니면 undefined", () => {
    const prev = minimalChatRoom([]);
    prev.messageList.list = [
      {
        id: "uuid",
        senderUsername: "u",
        content: "x",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "2026-01-01",
      },
    ];
    expect(
      mergeChatRoomWithReadSocketMessage(prev, readPayload(10, []))
    ).toBeUndefined();
  });
});
