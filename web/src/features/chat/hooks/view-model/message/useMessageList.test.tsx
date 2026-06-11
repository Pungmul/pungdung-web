import type { PropsWithChildren } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Message } from "../../../types/chat-message.types";
import type { ChatRoom } from "../../../types/chat-room.types";
import type { PendingMessage } from "../../../types/pending-message.types";

import { useMessageList } from "./useMessageList";

const text = (
  id: number | string,
  createdAt: string,
  overrides: Partial<Message> = {}
): Message =>
  ({
    id,
    senderUsername: "u",
    content: "c",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "r",
    createdAt,
    ...overrides,
  } as Message);

describe("useMessageList", () => {
  const wrapper = ({ children }: PropsWithChildren) => <>{children}</>;

  it("같은 id는 socketMessages가 infiniteData를 덮어쓴다", () => {
    const { result } = renderHook(
      () =>
        useMessageList({
          infiniteData: {
            pages: [
              {
                messages: [text(1, "2026-01-01T09:00:00Z")],
                hasMore: true,
                nextCursor: 2,
              },
            ],
            pageParams: [undefined],
          },
          socketMessages: [text(1, "2026-01-01T10:00:00Z")],
        }),
      { wrapper }
    );
    const ids = result.current.map((m) => m.id);
    expect(ids).toEqual([1]);
    expect(result.current[0]?.createdAt).toBe("2026-01-01T10:00:00Z");
  });

  it("createdAt 기준 정렬 후 pending을 항상 뒤에 붙인다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "p1",
        senderUsername: "u",
        content: "q",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "2099-12-31 23:59:59",
        state: "pending",
      },
    ];
    const { result } = renderHook(
      () =>
        useMessageList({
          chatRoomData: {
            messageList: {
              hasMore: false,
              nextCursor: null,
              list: [
                text(2, "2026-01-02T00:00:00Z"),
                text(1, "2026-01-01T00:00:00Z"),
              ],
            },
          } as ChatRoom,
          socketMessages: [],
          pendingMessages: pending,
        }),
      { wrapper }
    );
    expect(result.current.map((m) => m.id)).toEqual([1, 2, "p1"]);
  });

  it("confirmed 메시지와 매칭되는 pending은 렌더 결과에서 숨긴다", () => {
    const pending: PendingMessage[] = [
      {
        id: "p1",
        clientId: "c1",
        senderUsername: "u",
        content: "c",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: "r",
        createdAt: "2026-01-01 00:00:00",
        state: "pending",
      },
    ];
    const { result } = renderHook(
      () =>
        useMessageList({
          infiniteData: {
            pages: [
              {
                messages: [text(1, "2026-01-01T00:00:01Z", { clientId: "c1" })],
                hasMore: false,
                nextCursor: null,
              },
            ],
            pageParams: [undefined],
          },
          socketMessages: [],
          pendingMessages: pending,
        }),
      { wrapper }
    );

    expect(result.current.map((m) => m.id)).toEqual([1]);
  });
});
