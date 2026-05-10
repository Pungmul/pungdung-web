import type { UserLastReadMessageIdDto } from "../../../api/client/dto.schema";
import type { UserLastReadMessageId } from "../../../types/chat-room.types";

export function mapUserLastReadMessageIdDtoToDomain(
  dto: UserLastReadMessageIdDto
): UserLastReadMessageId {
  return {
    userId: dto.userId,
    lastReadMessageId: dto.lastReadMessageId,
  };
}
