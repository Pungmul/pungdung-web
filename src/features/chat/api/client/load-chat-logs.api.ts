import { messageListDtoSchema } from "./dto.schema";
import {
  mapMessageListDtoToDomain,
} from "../../lib/mappers";
import type { MessageList } from "../../types/domain/chat-message.types";

export const loadChatLogs = async (
  roomId: string,
  page: number = 2
): Promise<MessageList> => {
  const response = await fetch(`/api/chats/${roomId}/chatlog?page=${page}`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("채팅 로그를 불러오는데 실패했습니다.");
  }

  const dto = messageListDtoSchema.parse(await response.json());
  return mapMessageListDtoToDomain({ ...dto, pageNum: page });
};
