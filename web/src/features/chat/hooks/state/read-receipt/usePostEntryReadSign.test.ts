import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createEntryReadSignCoord } from "./entry-read-sign-coord";
import { usePostEntryReadSign } from "./usePostEntryReadSign";
import type { Message } from "../../../types";

const message = (id: number | string): Message =>
  ({
    id,
    createdAt: "2026-01-01T00:00:00.000Z",
  }) as Message;

describe("usePostEntryReadSign", () => {
  it("스냅샷 확정 전에는 readSign을 호출하지 않는다", () => {
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    renderHook(() =>
      usePostEntryReadSign({
        isEntrySnapshotCaptured: false,
        messageList: [message(10)],
        readSign,
        coordRef,
      })
    );

    expect(readSign).not.toHaveBeenCalled();
  });

  it("스냅샷 확정 후 최신 메시지 id로 readSign을 1회 호출한다", () => {
    vi.useFakeTimers();
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    renderHook(() =>
      usePostEntryReadSign({
        isEntrySnapshotCaptured: true,
        messageList: [message(8), message(12)],
        readSign,
        coordRef,
      })
    );

    vi.advanceTimersByTime(100);

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledWith({
      upToMessageId: 12,
      source: "post-entry",
    });

    vi.useRealTimers();
  });

  it("messageList가 안정된 뒤 최신 id로 readSign을 1회만 호출한다", () => {
    vi.useFakeTimers();
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { rerender } = renderHook(
      (props) => usePostEntryReadSign(props),
      {
        initialProps: {
          isEntrySnapshotCaptured: true,
          messageList: [message(5)],
          readSign,
          coordRef,
        },
      }
    );

    rerender({
      isEntrySnapshotCaptured: true,
      messageList: [message(5), message(9)],
      readSign,
      coordRef,
    });

    vi.advanceTimersByTime(100);

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledWith({
      upToMessageId: 9,
      source: "post-entry",
    });

    vi.useRealTimers();
  });

  it("roomId가 바뀌면 다시 readSign을 호출한다", () => {
    vi.useFakeTimers();
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { rerender } = renderHook(
      (props) => usePostEntryReadSign(props),
      {
        initialProps: {
          isEntrySnapshotCaptured: true,
          messageList: [message(3)],
          readSign,
          coordRef,
        },
      }
    );

    vi.advanceTimersByTime(100);

    coordRef.current = createEntryReadSignCoord("room-b");
    rerender({
      isEntrySnapshotCaptured: true,
      messageList: [message(7)],
      readSign,
      coordRef,
    });

    vi.advanceTimersByTime(100);

    expect(readSign).toHaveBeenCalledTimes(2);
    expect(readSign).toHaveBeenNthCalledWith(1, {
      upToMessageId: 3,
      source: "post-entry",
    });
    expect(readSign).toHaveBeenNthCalledWith(2, {
      upToMessageId: 7,
      source: "post-entry",
    });

    vi.useRealTimers();
  });

  it("이미 readSign 처리됨 플래그가 있으면 post-entry를 건너뛴다", () => {
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };
    coordRef.current.readSignHandled = true;

    renderHook(() =>
      usePostEntryReadSign({
        isEntrySnapshotCaptured: true,
        messageList: [message(10)],
        readSign,
        coordRef,
      })
    );

    expect(readSign).not.toHaveBeenCalled();
  });

  it("숫자 id가 나중에 생기면 post-entry readSign을 호출한다", () => {
    vi.useFakeTimers();
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { rerender } = renderHook(
      (props) => usePostEntryReadSign(props),
      {
        initialProps: {
          isEntrySnapshotCaptured: true,
          messageList: [message("temp-id")] as Message[],
          readSign,
          coordRef,
        },
      }
    );

    vi.advanceTimersByTime(100);
    expect(readSign).not.toHaveBeenCalled();

    rerender({
      isEntrySnapshotCaptured: true,
      messageList: [message("temp-id"), message(42)],
      readSign,
      coordRef,
    });

    vi.advanceTimersByTime(100);
    expect(readSign).toHaveBeenCalledWith({
      upToMessageId: 42,
      source: "post-entry",
    });

    vi.useRealTimers();
  });
});
