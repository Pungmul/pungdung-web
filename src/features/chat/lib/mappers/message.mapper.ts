import type {
  ChatLogCursorPageDto,
  MessageDto,
  MessageListDto,
} from "../../api/client/dto.schema";
import type {
  ChatLogCursorPage,
  Message,
  MessageList,
} from "../../types/domain/chat-message.types";

export function mapMessageDtoToDomain(dto: MessageDto): Message {
  switch (dto.chatType) {
    case "TEXT":
      return { ...dto };
    case "IMAGE":
      return { ...dto };
    case "LEAVE":
      return { ...dto };
    case "JOIN":
      return { ...dto };
  }
}

export function mapChatLogCursorPageDtoToDomain(
  dto: ChatLogCursorPageDto
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
