import { describe, expect, it } from "vitest";

import type {
  ChatLogCursorPage,
  ChatRoom,
  Message,
  PendingMessage,
} from "../types";

import { mergeChatMessagesForRender } from "./merge-chat-messages-for-render.service";

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

const pendingTextMessage = (
  override: Partial<Extract<PendingMessage, { chatType: "TEXT" }>> = {}
): PendingMessage => ({
  id: "pending-1",
  clientId: "client-1",
  senderUsername: "me",
  content: "pending-message",
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room-1",
  createdAt: "2026-05-17T10:00:04.000Z",
  state: "pending",
  ...override,
});

describe("mergeChatMessagesForRender", () => {
  it("id 기준으로 dedupe 하면서 최신 소스(socket)가 이전 소스 값을 override하고 시간순으로 정렬한다", () => {
    const cachedMessages: Message[] = [
      textMessage(1, "2026-05-17T10:00:01.000Z", { content: "cached" }),
      textMessage(4, "2026-05-17T10:00:04.000Z"),
    ];

    const infiniteData = {
      pages: [
        {
          messages: [
            textMessage(1, "2026-05-17T10:00:01.000Z", {
              content: "from-infinite",
            }),
            textMessage(2, "2026-05-17T10:00:02.000Z"),
          ],
          hasMore: true,
          nextCursor: 1,
        },
      ],
      pageParams: [undefined],
    } as const as { pages: ChatLogCursorPage[]; pageParams: unknown[] };

    const chatRoomData: ChatRoom = {
      chatRoomInfo: {
        chatRoomUUID: "room-1",
        roomName: "room",
        profileImageUrl: null,
        group: false,
      },
      userInfoList: [],
      userInitReadList: [],
      messageList: {
        list: [
          textMessage(1, "2026-05-17T10:00:01.000Z", { content: "from-room" }),
          textMessage(3, "2026-05-17T10:00:03.000Z"),
        ],
        hasMore: false,
        nextCursor: null,
      },
    };

    const socketMessages: Message[] = [
      textMessage(1, "2026-05-17T10:00:01.000Z", { content: "from-socket" }),
      textMessage(5, "2026-05-17T10:00:05.000Z"),
    ];

    const result = mergeChatMessagesForRender({
      cachedMessages,
      infiniteData: infiniteData as never,
      chatRoomData,
      socketMessages,
      pendingMessages: [],
    });

    const confirmed = result as Message[];

    expect(confirmed.map((m) => String(m.id))).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
    expect(confirmed.map((m) => m.createdAt)).toEqual([
      "2026-05-17T10:00:01.000Z",
      "2026-05-17T10:00:02.000Z",
      "2026-05-17T10:00:03.000Z",
      "2026-05-17T10:00:04.000Z",
      "2026-05-17T10:00:05.000Z",
    ]);
    expect(confirmed.find((m) => String(m.id) === "1")?.content).toBe(
      "from-socket"
    );
  });

  it("confirmed와 매칭되는 pending은 제외하고 매칭되지 않는 pending은 유지한다", () => {
    const socketMessages: Message[] = [
      textMessage(11, "2026-05-17T10:00:01.000Z", {
        senderUsername: "me",
        content: "same-content",
      }),
    ];

    const shadowedWithClientId = pendingTextMessage({
      id: "pending-shadowed",
      content: "same-content",
      clientId: "client-shadowed",
      createdAt: "2026-05-17T10:00:00.500Z",
    });
    const { clientId: _removedClientId, ...shadowedPending } =
      shadowedWithClientId;

    const remainingPending = pendingTextMessage({
      id: "pending-keep",
      content: "different-content",
      clientId: "client-keep",
      createdAt: "2026-05-17T10:00:03.000Z",
    });

    const result = mergeChatMessagesForRender({
      socketMessages,
      pendingMessages: [shadowedPending, remainingPending],
    });

    expect(result.map((m) => String(m.id))).toEqual(["11", "pending-keep"]);
  });
});
