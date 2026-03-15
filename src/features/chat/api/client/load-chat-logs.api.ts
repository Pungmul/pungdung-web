import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { mapChatLogCursorPageDtoToDomain } from "../../lib/mappers";
import type { ChatLogCursorPage } from "../../types/domain/chat-message.types";
import { CHAT_LOG_PAGE_SIZE } from "../../constants";
import { chatLogCursorPageDtoSchema } from "./dto.schema";

export const loadChatLogs = (
  roomId: string,
  beforeId: number | undefined,
  size: number = CHAT_LOG_PAGE_SIZE
): Promise<ChatLogCursorPage> =>
  withResponseMapper({
    context: "loadChatLogs",
    fetchDto: () => {
      const qs = new URLSearchParams({ size: String(size) });
      if (beforeId !== undefined) {
        qs.set("beforeId", String(beforeId));
      }
      return clientApiRequest({
        url: `/api/chats/${roomId}/chatlog?${qs.toString()}`,
        method: "GET",
        responseSchema: chatLogCursorPageDtoSchema,
      });
    },
    map: mapChatLogCursorPageDtoToDomain,
  });
