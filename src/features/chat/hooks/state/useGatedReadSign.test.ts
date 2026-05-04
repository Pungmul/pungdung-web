import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createEntryReadSignCoord, createEntryReadSignGate } from "./entry-read-sign-coord";
import { useEntryReadSnapshot } from "./useEntryReadSnapshot";
import { useGatedReadSign } from "./useGatedReadSign";
import type { ReadSignFn } from "../../socket/read-sign.types";
import type { Message } from "../../types";
import type { ChatRoom } from "../../types/chat-room.types";

const message = (id: number): Message =>
  ({
    id,
    senderUsername: "me",
    content: "hello",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "room-a",
    createdAt: "2026-01-01T00:00:00.000Z",
  }) as Message;

const chatRoomData = {
  chatRoomInfo: {
    chatRoomUUID: "room-a",
    roomName: "Room A",
    profileImageUrl: null,
    group: true,
  },
  userInfoList: [{ userId: 1, username: "me" }],
  messageList: {
    list: [message(10)],
    hasMore: false,
    nextCursor: null,
  },
  userInitReadList: [{ userId: 1, lastReadMessageId: 1 }],
} as unknown as ChatRoom;

function useEntryReadWithGatedReadSign({
  readSign,
  coordRef,
  chatRoomData: roomData,
  messageList,
  isRoomInfoReadyForEntrySnapshot,
}: {
  readSign: ReadSignFn;
  coordRef: { current: ReturnType<typeof createEntryReadSignCoord> };
  chatRoomData: ChatRoom | undefined;
  messageList: Message[];
  isRoomInfoReadyForEntrySnapshot: boolean;
}) {
  useEntryReadSnapshot(
    "room-a",
    roomData,
    "me",
    messageList,
    isRoomInfoReadyForEntrySnapshot,
    coordRef
  );

  return useGatedReadSign({
    roomId: "room-a",
    readSign,
    coordRef,
  });
}

describe("useGatedReadSign", () => {
  it("snapshot 전에는 publish되지 않는다", () => {
    const readSign = vi.fn<ReadSignFn>();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { result } = renderHook(() =>
      useEntryReadWithGatedReadSign({
        readSign,
        coordRef,
        chatRoomData: undefined,
        messageList: [],
        isRoomInfoReadyForEntrySnapshot: false,
      })
    );

    act(() => {
      result.current({ upToMessageId: 5 });
    });

    expect(readSign).not.toHaveBeenCalled();
    expect(createEntryReadSignGate(coordRef).canPublishReadSign("room-a")).toBe(
      false
    );
  });

  it("snapshot 후에는 publish되고 handled를 표시한다", () => {
    const readSign = vi.fn<ReadSignFn>();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { result } = renderHook(() =>
      useEntryReadWithGatedReadSign({
        readSign,
        coordRef,
        chatRoomData,
        messageList: [message(10)],
        isRoomInfoReadyForEntrySnapshot: true,
      })
    );

    expect(createEntryReadSignGate(coordRef).canPublishReadSign("room-a")).toBe(
      true
    );

    act(() => {
      result.current({ upToMessageId: 10 });
    });

    expect(readSign).toHaveBeenCalledWith({ upToMessageId: 10 });
    expect(coordRef.current.readSignHandled).toBe(true);
  });
});
