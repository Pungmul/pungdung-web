import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createEntryReadSignCoord } from "./entry-read-sign-coord";
import { usePostEntryReadSign } from "./usePostEntryReadSign";
import type { Message } from "../../types";

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

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledWith({ upToMessageId: 12 });
  });

  it("같은 room에서는 readSign을 다시 호출하지 않는다", () => {
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

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledWith({ upToMessageId: 5 });
  });

  it("roomId가 바뀌면 다시 readSign을 호출한다", () => {
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

    coordRef.current = createEntryReadSignCoord("room-b");
    rerender({
      isEntrySnapshotCaptured: true,
      messageList: [message(7)],
      readSign,
      coordRef,
    });

    expect(readSign).toHaveBeenCalledTimes(2);
    expect(readSign).toHaveBeenNthCalledWith(1, { upToMessageId: 3 });
    expect(readSign).toHaveBeenNthCalledWith(2, { upToMessageId: 7 });
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

  it("메시지가 비었거나 숫자 id가 없으면 bare readSign()을 호출한다", () => {
    const readSign = vi.fn();
    const coordRef = { current: createEntryReadSignCoord("room-a") };

    const { rerender } = renderHook(
      (props) => usePostEntryReadSign(props),
      {
        initialProps: {
          isEntrySnapshotCaptured: true,
          messageList: [] as Message[],
          readSign,
          coordRef,
        },
      }
    );

    coordRef.current = createEntryReadSignCoord("room-b");
    rerender({
      isEntrySnapshotCaptured: true,
      messageList: [message("temp-id")],
      readSign,
      coordRef,
    });

    expect(readSign).toHaveBeenCalledTimes(2);
    expect(readSign).toHaveBeenNthCalledWith(1);
    expect(readSign).toHaveBeenNthCalledWith(2);
  });
});
