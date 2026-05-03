import { loadChatLogs } from "../api";
import { CHAT_LOG_PAGE_SIZE } from "../constants";
import { getChatRoomMessagesCache } from "../lib";

import { fetchChatRoomMessageGapBackward } from "./fetch-chat-room-gap-backward.service";
import { toNumericMessageId } from "../lib/parse-message-id";
import type { Message } from "../types";

export async function fetchChatRoomMessageGap(
  roomId: string
): Promise<Message[]> {
  const cache = await getChatRoomMessagesCache(roomId);
  const afterMessageId = toNumericMessageId(cache?.newestMessageId);

  return fetchChatRoomMessageGapBackward({
    roomId,
    afterMessageId,
    fetchPage: (targetRoomId, beforeId) =>
      loadChatLogs(targetRoomId, beforeId, CHAT_LOG_PAGE_SIZE),
  });
}
