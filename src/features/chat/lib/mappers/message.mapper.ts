import type { MessageDto, MessageListDto } from "../../api/client/dto.schema";
import type { Message, MessageList } from "../../types/domain/chat-message.types";

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

export function mapMessageListDtoToDomain(dto: MessageListDto): MessageList {
  return {
    total: dto.total,
    list: dto.list.map(mapMessageDtoToDomain),
    pageNum: dto.pageNum,
    pageSize: dto.pageSize,
    size: dto.size,
    startRow: dto.startRow,
    endRow: dto.endRow,
    pages: dto.pages,
    prePage: dto.prePage,
    nextPage: dto.nextPage,
    isFirstPage: dto.isFirstPage,
    isLastPage: dto.isLastPage,
    hasPreviousPage: dto.hasPreviousPage,
    hasNextPage: dto.hasNextPage,
    navigatePages: dto.navigatePages,
    navigatepageNums: dto.navigatepageNums,
    navigateFirstPage: dto.navigateFirstPage,
    navigateLastPage: dto.navigateLastPage,
  };
}
