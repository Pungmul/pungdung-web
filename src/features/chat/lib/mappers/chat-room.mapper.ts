import { mapChatRoomInfoDtoToDomain } from "./chat-room-info.mapper";
import { mapChatRoomUserDtoToDomain } from "./chat-room-user.mapper";
import { mapMessageListDtoToDomain } from "./map-message-list-dto-to-domain.mapper";
import { mapUserLastReadMessageIdDtoToDomain } from "./user-last-read-message-id.mapper";
import type { ChatRoomDto } from "../../api/client/dto.schema";
import type { ChatRoom } from "../../types/chat-room.types";

export function mapChatRoomDtoToDomain(dto: ChatRoomDto): ChatRoom {
  return {
    chatRoomInfo: mapChatRoomInfoDtoToDomain(dto.chatRoomInfo),
    userInfoList: dto.userInfoList.map(mapChatRoomUserDtoToDomain),
    messageList: mapMessageListDtoToDomain(dto.messageList),
    userInitReadList: dto.userInitReadList.map(mapUserLastReadMessageIdDtoToDomain),
  };
}
