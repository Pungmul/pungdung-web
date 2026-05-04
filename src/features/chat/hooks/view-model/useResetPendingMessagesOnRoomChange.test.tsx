import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePendingMessages } from "./usePendingMessages";
import { useResetPendingMessagesOnRoomChange } from "./useResetPendingMessagesOnRoomChange";

function usePendingWithRoomReset(roomId: string) {
  const pending = usePendingMessages();
  useResetPendingMessagesOnRoomChange(pending.setPendingMessages, roomId);

  return pending;
}

describe("useResetPendingMessagesOnRoomChange", () => {
  it("clears pending messages when roomId changes", () => {
    const { result, rerender } = renderHook(
      ({ roomId }) => usePendingWithRoomReset(roomId),
      { initialProps: { roomId: "room-1" } }
    );

    act(() => {
      result.current.enqueueText({
        senderUsername: "me",
        content: "hello",
        chatRoomUUID: "room-1",
      });
    });
    expect(result.current.pendingMessages).toHaveLength(1);

    rerender({ roomId: "room-2" });
    expect(result.current.pendingMessages).toHaveLength(0);
  });
});
