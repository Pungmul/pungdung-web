import { describe, expect, it, vi } from "vitest";

import type { ChatLogCursorPage, Message } from "../../types";

import { fetchChatRoomMessageGapBackward } from "./fetch-chat-room-gap-backward.service";

const text = (id: number): Message =>
  ({
    id,
    senderUsername: "u",
    content: "c",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "room-1",
    createdAt: `2026-01-01T00:00:${String(id).padStart(2, "0")}Z`,
  } as Message);

const page = (
  messages: Message[],
  hasMore: boolean,
  nextCursor: number | null = null
): ChatLogCursorPage => ({
  messages,
  hasMore,
  nextCursor,
});

describe("fetchChatRoomMessageGapBackward", () => {
  it("afterMessageId가 없으면 최신 페이지만 반환한다", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValue(page([text(100), text(99)], false));

    const result = await fetchChatRoomMessageGapBackward({
      roomId: "room-1",
      afterMessageId: null,
      fetchPage,
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchPage).toHaveBeenCalledWith("room-1");
    expect(result.map((message) => message.id)).toEqual([100, 99]);
  });

  it("첫 페이지에 gap이 모두 있으면 추가 요청하지 않는다", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValue(
        page([text(100), text(99), text(98), text(81)], true, 81)
      );

    const result = await fetchChatRoomMessageGapBackward({
      roomId: "room-1",
      afterMessageId: 95,
      fetchPage,
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result.map((message) => message.id)).toEqual([100, 99, 98]);
  });

  it("gap이 길면 beforeId로 역방향 페이지를 추가 조회한다", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(
        page([text(100), text(99), text(98), text(81)], true, 81)
      )
      .mockResolvedValueOnce(
        page([text(80), text(79), text(78), text(61)], true, 61)
      );

    const result = await fetchChatRoomMessageGapBackward({
      roomId: "room-1",
      afterMessageId: 70,
      fetchPage,
    });

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenNthCalledWith(1, "room-1", undefined);
    expect(fetchPage).toHaveBeenNthCalledWith(2, "room-1", 81);
    expect(result.map((message) => message.id)).toEqual([
      100, 99, 98, 81, 80, 79, 78,
    ]);
  });
});
