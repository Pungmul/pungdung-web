import { describe, expect, it, vi } from "vitest";

import type { Message } from "../types/domain/chat-message.types";
import type { PendingMessage } from "../types/pending-message.types";

import {
  normalizeSocketImageMessage,
  normalizeSocketTextMessage,
  removePendingMatchedBySocketTextEcho,
} from "./socket-chat-incoming.service";

const textMessage = (over: Partial<Message> & Pick<Message, "id">): Message =>
  ({
    senderUsername: over.senderUsername ?? "me",
    content: over.content ?? "hello",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: over.chatRoomUUID ?? "room",
    createdAt: over.createdAt ?? "",
    ...over,
  } as Message);

describe("socket-chat-incoming.service", () => {
  it("normalizeSocketTextMessage는 falsy content를 빈 문자열로 정규화한다", () => {
    const m = textMessage({ id: 1, content: "" });
    expect(normalizeSocketTextMessage(m).content).toBe("");
    expect(normalizeSocketTextMessage(m).chatType).toBe("TEXT");
  });

  it("normalizeSocketImageMessage는 imageUrlList가 없으면 빈 배열로 둔다", () => {
    const m: Message = {
      id: 1,
      senderUsername: "me",
      content: null,
      chatType: "IMAGE",
      imageUrlList: [],
      chatRoomUUID: "room",
      createdAt: "",
    };
    const normalized = normalizeSocketImageMessage({
      ...m,
      imageUrlList: null as never,
    });
    expect(normalized.imageUrlList).toEqual([]);
    expect(normalized.content).toBeNull();
  });

  it("removePendingMatchedBySocketTextEcho는 내 텍스트 에코와 content가 같을 때만 한 건 제거한다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "c1",
        senderUsername: "me",
        content: "a",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "t",
        state: "pending",
      },
      {
        id: "p2",
        clientId: "c2",
        senderUsername: "me",
        content: "b",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "t",
        state: "pending",
      },
    ];
    const socket = textMessage({
      id: 99,
      senderUsername: "me",
      content: "a",
      chatRoomUUID: "r",
    });
    const next = removePendingMatchedBySocketTextEcho(pending, socket, "me");
    expect(next).toHaveLength(1);
    expect(next[0]?.content).toBe("b");
  });

  it("다른 유저 메시지면 pending을 건드리지 않는다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "c1",
        senderUsername: "me",
        content: "a",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "t",
        state: "pending",
      },
    ];
    const socket = textMessage({
      id: 1,
      senderUsername: "other",
      content: "a",
    });
    expect(removePendingMatchedBySocketTextEcho(pending, socket, "me")).toBe(
      pending
    );
  });

  it("다른 방 메시지면 같은 content여도 pending을 건드리지 않는다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "c1",
        senderUsername: "me",
        content: "a",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "t",
        state: "pending",
      },
    ];
    const socket = textMessage({
      id: 1,
      senderUsername: "me",
      content: "a",
      chatRoomUUID: "other-room",
    });
    expect(removePendingMatchedBySocketTextEcho(pending, socket, "me")).toBe(
      pending
    );
  });

  it("failed 메시지는 같은 content여도 socket echo 제거 대상이 아니다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "c1",
        senderUsername: "me",
        content: "a",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "t",
        state: "failed",
      },
    ];
    const socket = textMessage({
      id: 1,
      senderUsername: "me",
      content: "a",
      chatRoomUUID: "r",
    });
    expect(removePendingMatchedBySocketTextEcho(pending, socket, "me")).toBe(
      pending
    );
  });

  it("dayjs 기본 createdAt을 채운다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T12:00:00.000Z"));
    const m = textMessage({ id: 1, createdAt: "" });
    const n = normalizeSocketTextMessage({ ...m, createdAt: "" });
    expect(n.createdAt).toMatch(/2026-05-01/);
    vi.useRealTimers();
  });

  it("socket clientId가 있으면 타입과 content와 무관하게 clientId로 pending을 제거한다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "same-client-id",
        senderUsername: "me",
        content: null,
        chatType: "IMAGE",
        imageUrlList: ["blob:a"],
        chatRoomUUID: "r",
        createdAt: "t",
        state: "pending",
      },
    ];
    const socket: Message = {
      id: 1,
      clientId: "same-client-id",
      senderUsername: "me",
      content: null,
      chatType: "IMAGE",
      imageUrlList: ["https://image"],
      chatRoomUUID: "r",
      createdAt: "t",
    };
    expect(removePendingMatchedBySocketTextEcho(pending, socket, "me")).toEqual(
      []
    );
  });
});
