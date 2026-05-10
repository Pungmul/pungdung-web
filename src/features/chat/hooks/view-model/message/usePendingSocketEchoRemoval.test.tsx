import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Message } from "../../../types";
import { useOutgoingMessageHandlers } from "./useOutgoingMessageHandlers";
import { usePendingMessages } from "./usePendingMessages";
import { usePendingSocketEchoRemoval } from "./usePendingSocketEchoRemoval";

type TextMessage = Extract<Message, { chatType: "TEXT" }>;

function textMessage(overrides: Partial<TextMessage> = {}): TextMessage {
  return {
    id: 100,
    senderUsername: "me",
    content: "hello",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "room-1",
    createdAt: "2026-01-01 00:00:00",
    ...overrides,
  };
}

function usePendingWithSocketEchoRemoval(
  roomId: string,
  senderUsername: string
) {
  const pending = usePendingMessages();
  const outgoingMessageHandlers = useOutgoingMessageHandlers({
    roomId,
    senderUsername,
    enqueueText: pending.enqueueText,
    enqueueImage: pending.enqueueImage,
    requeueTextFailedAtEnd: pending.requeueTextFailedAtEnd,
    requeueImageFailedAtEnd: pending.requeueImageFailedAtEnd,
    removeById: pending.removeById,
    failById: pending.failById,
  });
  const removePendingOnSocketEcho = usePendingSocketEchoRemoval({
    setPendingMessages: pending.setPendingMessages,
    senderUsername,
  });

  return {
    pendingMessages: pending.pendingMessages,
    outgoingMessageHandlers,
    removePendingOnSocketEcho,
  };
}

describe("usePendingSocketEchoRemoval", () => {
  it("removes one pending message when socket text echo matches", () => {
    const { result } = renderHook(() =>
      usePendingWithSocketEchoRemoval("room-1", "me")
    );

    act(() => {
      result.current.outgoingMessageHandlers.beginTextSend("hello");
    });
    expect(result.current.pendingMessages).toHaveLength(1);

    act(() => {
      result.current.removePendingOnSocketEcho(textMessage());
    });
    expect(result.current.pendingMessages).toHaveLength(0);
  });

  it("does not remove pending messages when senderUsername is empty", () => {
    const { result } = renderHook(() =>
      usePendingWithSocketEchoRemoval("room-1", "")
    );

    act(() => {
      result.current.outgoingMessageHandlers.beginTextSend("hello");
    });
    expect(result.current.pendingMessages).toHaveLength(1);

    act(() => {
      result.current.removePendingOnSocketEcho(
        textMessage({ senderUsername: "" })
      );
    });
    expect(result.current.pendingMessages).toHaveLength(1);
  });
});
