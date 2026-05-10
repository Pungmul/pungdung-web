import { describe, expect, it } from "vitest";

import type { Message } from "../../types";

import { mergeIndexedDBMessagesWithQueries } from "./merge-indexed-db-messages-with-queries.service";

const textMessage = (
  id: number | string,
  createdAt: string,
  override: Partial<Extract<Message, { chatType: "TEXT" }>> = {}
): Message => ({
  id,
  senderUsername: "user",
  content: `message-${id}`,
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room-1",
  createdAt,
  ...override,
});

describe("mergeIndexedDBMessagesWithQueries", () => {
  it("id 기준 dedup 하면서 최신 소스 값으로 덮고 oldest-first로 정렬한다", () => {
    const cachedAll = [
      textMessage(10, "2026-05-17T10:00:10.000Z", { content: "cached-10" }),
      textMessage(20, "2026-05-17T10:00:20.000Z", { content: "cached-20" }),
    ];
    const fromInfinite = [
      textMessage(20, "2026-05-17T10:00:20.000Z", { content: "infinite-20" }),
      textMessage(30, "2026-05-17T10:00:30.000Z", { content: "infinite-30" }),
    ];
    const fromRoom = [
      textMessage(30, "2026-05-17T10:00:30.000Z", { content: "room-30" }),
      textMessage(40, "2026-05-17T10:00:40.000Z", { content: "room-40" }),
    ];

    const merged = mergeIndexedDBMessagesWithQueries(
      cachedAll,
      fromInfinite,
      fromRoom
    );

    expect(merged.map((message) => String(message.id))).toEqual([
      "10",
      "20",
      "30",
      "40",
    ]);
    expect(merged.find((message) => String(message.id) === "20")?.content).toBe(
      "infinite-20"
    );
    expect(merged.find((message) => String(message.id) === "30")?.content).toBe(
      "room-30"
    );
  });

  it("비숫자 id와 숫자 id가 섞여도 canonical comparator로 oldest-first 정렬한다", () => {
    const merged = mergeIndexedDBMessagesWithQueries(
      [textMessage("pending-a", "2026-05-17T10:00:03.000Z")],
      [textMessage(100, "2026-05-17T10:00:02.000Z")],
      [textMessage("pending-b", "2026-05-17T10:00:01.000Z")]
    );

    expect(merged.map((message) => String(message.id))).toEqual([
      "pending-b",
      "100",
      "pending-a",
    ]);
  });
});
