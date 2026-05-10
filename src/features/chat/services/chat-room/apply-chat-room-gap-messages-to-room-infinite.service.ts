import type { InfiniteData } from "@tanstack/react-query";

import { mergeChatMessagesNewestFirst } from "../../lib/message/merge-chat-messages-newest-first";
import type { ChatLogCursorPage, Message } from "../../types";

export function applyChatRoomGapMessagesToRoomInfinite(
  prev: InfiniteData<ChatLogCursorPage> | undefined,
  gapMessages: readonly Message[]
): InfiniteData<ChatLogCursorPage> {
  if (gapMessages.length === 0) {
    return prev ?? { pages: [], pageParams: [] };
  }

  if (!prev || prev.pages.length === 0) {
    return {
      pages: [
        {
          messages: [...gapMessages],
          hasMore: true,
          nextCursor: null,
        },
      ],
      pageParams: [undefined],
    };
  }

  const [firstPage, ...restPages] = prev.pages;
  if (!firstPage) {
    return prev;
  }

  return {
    ...prev,
    pages: [
      {
        ...firstPage,
        messages: mergeChatMessagesNewestFirst(firstPage.messages, gapMessages),
      },
      ...restPages,
    ],
  };
}
