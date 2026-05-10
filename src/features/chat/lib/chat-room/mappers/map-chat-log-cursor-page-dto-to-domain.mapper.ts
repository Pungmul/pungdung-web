import type { ChatLogCursorPageDto } from "../../../api/client/dto.schema";
import type { ChatLogCursorPage } from "../../../types/chat-message.types";
import { mapMessageDtoToDomain } from "../../message/mappers/map-message-dto-to-domain.mapper";

export function mapChatLogCursorPageDtoToDomain(
  dto: ChatLogCursorPageDto,
): ChatLogCursorPage {
  return {
    messages: dto.messages.map(mapMessageDtoToDomain),
    hasMore: dto.hasMore,
    nextCursor:
      dto.nextCursor === undefined || dto.nextCursor === null
        ? null
        : dto.nextCursor,
  };
}
