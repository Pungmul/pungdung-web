"use client";

import { useMemo } from "react";

import { NEW_MESSAGES_DIVIDER_MIN_UNREAD_COUNT } from "../../constants/ui.constants";
import { resolveNewMessagesDividerIndex } from "../../services";
import type { Message, PendingMessage } from "../../types";

type UseEntryNewMessagesDividerParams = {
  messages: readonly (Message | PendingMessage)[];
  entryLastReadMessageId: number | null;
  hadUnreadOnEntry: boolean;
};

export function useEntryNewMessagesDivider({
  messages,
  entryLastReadMessageId,
  hadUnreadOnEntry,
}: UseEntryNewMessagesDividerParams): number | null {
  return useMemo(() => {
    if (!hadUnreadOnEntry || entryLastReadMessageId === null) {
      return null;
    }

    return resolveNewMessagesDividerIndex(messages, entryLastReadMessageId, {
      minUnreadCount: NEW_MESSAGES_DIVIDER_MIN_UNREAD_COUNT,
    });
  }, [entryLastReadMessageId, hadUnreadOnEntry, messages]);
}
