import { CHAT_GAP_RECONCILE_MAX_PAGES } from "../constants";

import {
  getOldestMessageIdInNewestFirstPage,
  toNumericMessageId,
} from "../lib/parse-message-id";
import type { ChatLogCursorPage, Message } from "../types";

export type FetchChatLogPage = (
  roomId: string,
  beforeId?: number
) => Promise<ChatLogCursorPage>;

/**
 * afterId API 없이 beforeId 역방향 페이지를 모아
 * `afterMessageId` 이후 메시지(gap)만 반환한다.
 *
 * API 응답 `messages` 순서: 최신→오래된.
 */
export async function fetchChatRoomMessageGapBackward({
  roomId,
  afterMessageId,
  fetchPage,
  maxPages = CHAT_GAP_RECONCILE_MAX_PAGES,
}: {
  roomId: string;
  afterMessageId: number | null;
  fetchPage: FetchChatLogPage;
  maxPages?: number;
}): Promise<Message[]> {
  if (afterMessageId === null) {
    const page = await fetchPage(roomId);
    return page.messages;
  }

  const collected = new Map<string, Message>();
  let beforeId: number | undefined;
  let pagesFetched = 0;

  while (pagesFetched < maxPages) {
    const page = await fetchPage(roomId, beforeId);
    pagesFetched += 1;

    for (const message of page.messages) {
      collected.set(String(message.id), message);
    }

    const oldestInPage = getOldestMessageIdInNewestFirstPage(page.messages);
    if (oldestInPage === null) {
      break;
    }

    if (oldestInPage <= afterMessageId + 1) {
      break;
    }

    if (!page.hasMore) {
      break;
    }

    const nextBeforeId = page.nextCursor ?? oldestInPage;
    if (nextBeforeId === beforeId) {
      break;
    }

    beforeId = nextBeforeId;
  }

  return Array.from(collected.values()).filter((message) => {
    const messageId = toNumericMessageId(message.id);
    return messageId !== null && messageId > afterMessageId;
  });
}
