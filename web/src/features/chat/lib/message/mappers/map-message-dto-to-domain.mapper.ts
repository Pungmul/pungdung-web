import type { MessageDto } from "../../../api/client/dto.schema";
import type { Message } from "../../../types/chat-message.types";

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
