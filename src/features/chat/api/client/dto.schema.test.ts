import { describe, expect, it } from "vitest";

import {
  chatLogCursorPageDtoSchema,
  chatRoomListItemDtoSchema,
  chatRoomListResponseEnvelopeSchema,
  createChatRoomFailureDtoSchema,
  createChatRoomResponseDtoSchema,
  createChatRoomSuccessDtoSchema,
  isCreateChatRoomFailure,
  messageDtoSchema,
  messageListDtoSchema,
} from "./dto.schema";

describe("chat dto.schema — messageDtoSchema", () => {
  it("TEXT 메시지를 통과시킨다", () => {
    const parsed = messageDtoSchema.safeParse({
      id: 1,
      clientId: "c1",
      senderUsername: "u1",
      content: "hello",
      chatType: "TEXT",
      imageUrlList: null,
      chatRoomUUID: "room-1",
      createdAt: "2026-01-01T00:00:00Z",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.chatType).toBe("TEXT");
  });

  it("IMAGE 메시지를 통과시킨다", () => {
    const parsed = messageDtoSchema.safeParse({
      id: "2",
      clientId: null,
      senderUsername: "u1",
      content: null,
      chatType: "IMAGE",
      imageUrlList: ["https://x/img.png"],
      chatRoomUUID: "room-1",
      createdAt: "2026-01-01T00:00:00Z",
    });
    expect(parsed.success).toBe(true);
  });

  it("chatType이 잘못되면 discriminated union에서 실패한다", () => {
    const parsed = messageDtoSchema.safeParse({
      id: 1,
      senderUsername: "u1",
      content: "x",
      chatType: "TEXT",
      imageUrlList: ["https://bad"],
      chatRoomUUID: "room-1",
      createdAt: "2026-01-01T00:00:00Z",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("chat dto.schema — chatLogCursorPageDtoSchema", () => {
  it("messages, hasMore, nextCursor를 통과시킨다", () => {
    const parsed = chatLogCursorPageDtoSchema.safeParse({
      messages: [
        {
          id: 1,
          senderUsername: "u1",
          content: "a",
          chatType: "TEXT",
          imageUrlList: null,
          chatRoomUUID: "r",
          createdAt: "2026-01-01",
        },
      ],
      hasMore: true,
      nextCursor: 1234,
    });
    expect(parsed.success).toBe(true);
  });

  it("nextCursor 생략 시에도 통과한다", () => {
    const parsed = chatLogCursorPageDtoSchema.safeParse({
      messages: [],
      hasMore: false,
    });
    expect(parsed.success).toBe(true);
  });

  it("실제 응답 유사 페이로드(추가 메타 포함)도 통과한다", () => {
    const parsed = chatLogCursorPageDtoSchema.safeParse({
      total: 59,
      messages: [
        {
          id: 248,
          senderUsername: "ajtwoddl1236@naver.com",
          content: "a",
          chatType: "TEXT",
          imageUrlList: null,
          chatRoomUUID: "60f7bcf4-47d6-43b9-a886-43b0fd49cb22",
          isDeleted: false,
          createdAt: "2026-05-16T03:07:31",
        },
        {
          id: 267,
          senderUsername: "ajtwoddl1236@naver.com",
          content: "b",
          chatType: "TEXT",
          imageUrlList: null,
          chatRoomUUID: "60f7bcf4-47d6-43b9-a886-43b0fd49cb22",
          isDeleted: false,
          createdAt: "2026-05-16T14:01:28",
        },
      ],
      hasMore: true,
      nextCursor: 248,
    });

    expect(parsed.success).toBe(true);
  });
});

describe("chat dto.schema — messageListDtoSchema", () => {
  it("messages, hasMore, nextCursor를 통과시킨다", () => {
    const parsed = messageListDtoSchema.safeParse({
      messages: [
        {
          id: 1,
          senderUsername: "u1",
          content: "a",
          chatType: "TEXT",
          imageUrlList: null,
          chatRoomUUID: "r",
          createdAt: "2026-01-01",
        },
      ],
      hasMore: true,
      nextCursor: 1,
    });
    expect(parsed.success).toBe(true);
  });
});

describe("chat dto.schema — chatRoomListItemDtoSchema", () => {
  it("chatRoomMemberIds/Names가 null이면 빈 배열로 변환한다", () => {
    const parsed = chatRoomListItemDtoSchema.safeParse({
      chatRoomUUID: "r1",
      lastMessageTime: null,
      lastMessageContent: null,
      unreadCount: 0,
      senderId: null,
      senderName: null,
      receiverId: null,
      receiverName: null,
      chatRoomMemberIds: null,
      chatRoomMemberNames: undefined,
      roomName: "방",
      profileImageUrl: null,
      group: false,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.chatRoomMemberIds).toEqual([]);
      expect(parsed.data.chatRoomMemberNames).toEqual([]);
    }
  });
});

describe("chat dto.schema — chatRoomListResponseEnvelopeSchema", () => {
  it("list 배열 래퍼를 검증한다", () => {
    const parsed = chatRoomListResponseEnvelopeSchema.safeParse({
      list: [],
    });
    expect(parsed.success).toBe(true);
  });
});

describe("chat dto.schema — createChatRoom 응답", () => {
  it("createChatRoomSuccessDtoSchema는 roomUUID를 요구한다", () => {
    const ok = createChatRoomSuccessDtoSchema.safeParse({
      roomUUID: "new-room",
      extra: 1,
    });
    expect(ok.success).toBe(true);
  });

  it("createChatRoomFailureDtoSchema는 isSuccess false 본문을 통과시킨다", () => {
    const fail = createChatRoomFailureDtoSchema.safeParse({
      code: "CHAT-009",
      message: "요청 횟수 초과",
      response: null,
      isSuccess: false,
    });
    expect(fail.success).toBe(true);
  });

  it("createChatRoomResponseDtoSchema는 성공·실패 유니온을 구분한다", () => {
    const success = createChatRoomResponseDtoSchema.safeParse({
      roomUUID: "x",
    });
    expect(success.success).toBe(true);
    if (success.success) expect(isCreateChatRoomFailure(success.data)).toBe(false);

    const failure = createChatRoomResponseDtoSchema.safeParse({
      code: "E",
      message: "m",
      response: null,
      isSuccess: false,
    });
    expect(failure.success).toBe(true);
    if (failure.success) expect(isCreateChatRoomFailure(failure.data)).toBe(true);
  });
});
