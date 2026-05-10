"use client";

import { type Dispatch, type SetStateAction, useCallback } from "react";

import { removePendingMatchedBySocketTextEcho } from "../../../services";
import type { Message, PendingMessage } from "../../../types";

export type UsePendingSocketEchoRemovalParams = {
  setPendingMessages: Dispatch<SetStateAction<PendingMessage[]>>;
  senderUsername: string;
};

export function usePendingSocketEchoRemoval({
  setPendingMessages,
  senderUsername,
}: UsePendingSocketEchoRemovalParams) {
  return useCallback(
    (message: Message) => {
      if (!senderUsername) {
        return;
      }
      setPendingMessages((prev) =>
        removePendingMatchedBySocketTextEcho(prev, message, senderUsername)
      );
    },
    [senderUsername, setPendingMessages]
  );
}
