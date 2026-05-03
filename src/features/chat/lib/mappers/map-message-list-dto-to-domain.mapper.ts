import { mapMessageDtoToDomain } from "./map-message-dto-to-domain.mapper";
import type { MessageListDto } from "../../api/client/dto.schema";
import type { MessageList } from "../../types/chat-message.types";

export function mapMessageListDtoToDomain(dto: MessageListDto): MessageList {
  return {
    list: dto.messages.map(mapMessageDtoToDomain),
    hasMore: dto.hasMore,
    nextCursor:
      dto.nextCursor === undefined || dto.nextCursor === null
        ? null
        : dto.nextCursor,
  };
}
