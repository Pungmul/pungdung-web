import type { ChatRoomInfoDto } from "../../api/client/dto.schema";
import type { ChatRoomInfo } from "../../types/chat-room.types";

export function mapChatRoomInfoDtoToDomain(dto: ChatRoomInfoDto): ChatRoomInfo {
  return {
    chatRoomUUID: dto.chatRoomUUID,
    roomName: dto.roomName,
    profileImageUrl: dto.profileImageUrl,
    group: dto.group,
  };
}
