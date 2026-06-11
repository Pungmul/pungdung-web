import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChatRoomSocket } from "../../../socket/useChatRoomSocket";
import type { Message } from "../../../types";
import type { EntryReadSignGate } from "../../state/read-receipt/entry-read-sign-coord";
import { useChatRoomSocketMessages } from "./useChatRoomSocketMessages";

vi.mock("../../../socket/useChatRoomSocket", () => ({
  useChatRoomSocket: vi.fn(),
}));

const mockedUseChatRoomSocket = vi.mocked(useChatRoomSocket);

type TextMessage = Extract<Message, { chatType: "TEXT" }>;

function textMessage(overrides: Partial<TextMessage> = {}): TextMessage {
  return {
    id: 101,
    senderUsername: "alice",
    content: "hello",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: "room-1",
    createdAt: "2026-01-01 00:00:00",
    ...overrides,
  };
}

describe("useChatRoomSocketMessages", () => {
  beforeEach(() => {
    mockedUseChatRoomSocket.mockReset();
  });

  it("calls readSign when gate allows publishing", () => {
    let appended: ((message: Message) => void) | undefined;
    const replaceSocketBuffer = vi.fn();
    mockedUseChatRoomSocket.mockImplementation((params) => {
      appended = params.onSocketMessageAppended;
      return { socketMessages: [], replaceSocketBuffer };
    });

    const readSign = vi.fn();
    const gate: EntryReadSignGate = {
      canPublishReadSign: vi.fn(() => true),
      markReadSignHandled: vi.fn(),
    };
    const onSocketEchoMessage = vi.fn();

    renderHook(() =>
      useChatRoomSocketMessages({
        roomId: "room-1",
        readSign,
        entryReadSignGate: gate,
        onSocketEchoMessage,
      })
    );

    act(() => {
      appended?.(textMessage({ id: "15" }));
    });

    expect(onSocketEchoMessage).toHaveBeenCalledTimes(1);
    expect(gate.markReadSignHandled).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledWith({ upToMessageId: 15 });
  });

  it("does not call readSign when gate blocks publishing", () => {
    let appended: ((message: Message) => void) | undefined;
    const replaceSocketBuffer = vi.fn();
    mockedUseChatRoomSocket.mockImplementation((params) => {
      appended = params.onSocketMessageAppended;
      return { socketMessages: [], replaceSocketBuffer };
    });

    const readSign = vi.fn();
    const gate: EntryReadSignGate = {
      canPublishReadSign: vi.fn(() => false),
      markReadSignHandled: vi.fn(),
    };

    renderHook(() =>
      useChatRoomSocketMessages({
        roomId: "room-1",
        readSign,
        entryReadSignGate: gate,
        onSocketEchoMessage: vi.fn(),
      })
    );

    act(() => {
      appended?.(textMessage({ id: 20 }));
    });

    expect(gate.markReadSignHandled).not.toHaveBeenCalled();
    expect(readSign).not.toHaveBeenCalled();
  });

  it("resets socket buffer when roomId changes", () => {
    const replaceSocketBuffer = vi.fn();
    mockedUseChatRoomSocket.mockReturnValue({
      socketMessages: [],
      replaceSocketBuffer,
    });

    const { rerender } = renderHook(
      ({ roomId }) =>
        useChatRoomSocketMessages({
          roomId,
          readSign: vi.fn(),
          onSocketEchoMessage: vi.fn(),
        }),
      { initialProps: { roomId: "room-1" } }
    );

    rerender({ roomId: "room-2" });

    expect(replaceSocketBuffer).toHaveBeenCalledWith([]);
    expect(replaceSocketBuffer).toHaveBeenCalledTimes(2);
  });
});
