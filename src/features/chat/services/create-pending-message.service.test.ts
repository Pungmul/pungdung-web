import { describe, expect, it, vi } from "vitest";

import type { PendingMessage } from "../types/pending-message.types";

import {
  createPendingTextMessage,
  markMessageAsFailed,
  removePendingMessage,
  updateMessageToFailed,
} from "./create-pending-message.service";

vi.mock("uuid", () => ({
  v4: () => "fixed-uuid",
}));

describe("create-pending-message.service", () => {
  it("createPendingTextMessage는 pending TEXT 구조를 만든다", () => {
    const m = createPendingTextMessage({
      senderUsername: "u",
      content: "안녕",
      chatRoomUUID: "room-1",
    });
    expect(m.id).toBe("fixed-uuid");
    expect(m.chatType).toBe("TEXT");
    expect(m.state).toBe("pending");
    expect(m.content).toBe("안녕");
    expect(m.createdAt).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it("markMessageAsFailed는 state만 failed로 바꾼다", () => {
    const base: PendingMessage = {
      id: "1",
      senderUsername: "u",
      content: "x",
      chatType: "TEXT",
      imageUrlList: null,
      chatRoomUUID: "r",
      createdAt: "t",
      state: "pending",
    };
    expect(markMessageAsFailed(base)).toEqual({ ...base, state: "failed" });
  });

  it("updateMessageToFailed는 id가 일치하는 항목만 failed로", () => {
    const list: PendingMessage[] = [
      { id: "a", senderUsername: "u", content: "1", chatType: "TEXT", imageUrlList: null, chatRoomUUID: "r", createdAt: "t", state: "pending" },
      { id: "b", senderUsername: "u", content: "2", chatType: "TEXT", imageUrlList: null, chatRoomUUID: "r", createdAt: "t", state: "pending" },
    ];
    const next = updateMessageToFailed(list, "a");
    expect(next.find((x) => x.id === "a")?.state).toBe("failed");
    expect(next.find((x) => x.id === "b")?.state).toBe("pending");
  });

  it("removePendingMessage는 해당 id를 제거한다", () => {
    const list: PendingMessage[] = [
      { id: 1, senderUsername: "u", content: "1", chatType: "TEXT", imageUrlList: null, chatRoomUUID: "r", createdAt: "t", state: "pending" },
    ];
    expect(removePendingMessage(list, 1)).toEqual([]);
  });
});
