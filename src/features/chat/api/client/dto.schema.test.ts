import { describe, expect, it } from "vitest";

import {
  chatRoomListItemDtoSchema,
  chatRoomListResponseEnvelopeSchema,
  createChatRoomFailureDtoSchema,
  createChatRoomResponseDtoSchema,
  createChatRoomSuccessDtoSchema,
  isCreateChatRoomFailure,
  messageDtoSchema,
  messageListDtoSchema,
} from "./dto.schema";

const emptyPageMeta = {
  total: 0,
  pageNum: 1,
  pageSize: 20,
  size: 0,
  startRow: 0,
  endRow: 0,
  pages: 0,
  prePage: 0,
  nextPage: 0,
  isFirstPage: true,
  isLastPage: true,
  hasPreviousPage: false,
  hasNextPage: false,
  navigatePages: 8,
  navigatepageNums: [] as number[],
  navigateFirstPage: 1,
  navigateLastPage: 1,
};

describe("chat dto.schema — messageDtoSchema", () => {
  it("TEXT 메시지를 통과시킨다", () => {
    const parsed = messageDtoSchema.safeParse({
      id: 1,
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

describe("chat dto.schema — messageListDtoSchema", () => {
  it("페이지 메타와 메시지 리스트를 통과시킨다", () => {
    const parsed = messageListDtoSchema.safeParse({
      ...emptyPageMeta,
      list: [
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
