"use client";

import { type Dispatch, type SetStateAction, useLayoutEffect } from "react";

import type { PendingMessage } from "../../types";

export function useResetPendingMessagesOnRoomChange(
  setPendingMessages: Dispatch<SetStateAction<PendingMessage[]>>,
  roomId: string
) {
  useLayoutEffect(() => {
    setPendingMessages([]);
  }, [roomId, setPendingMessages]);
}
