import { mapChatRoomInfoDtoToDomain } from "./chat-room-info.mapper";
import { mapChatRoomUserDtoToDomain } from "./chat-room-user.mapper";
import type { ChatRoomDto } from "../../../api/client/dto.schema";
import type { ChatRoom } from "../../../types/chat-room.types";
import { mapMessageListDtoToDomain } from "../../message/mappers/map-message-list-dto-to-domain.mapper";
import { mapUserLastReadMessageIdDtoToDomain } from "../../read-receipt/mappers/user-last-read-message-id.mapper";

export function mapChatRoomDtoToDomain(dto: ChatRoomDto): ChatRoom {
  return {
    chatRoomInfo: mapChatRoomInfoDtoToDomain(dto.chatRoomInfo),
    userInfoList: dto.userInfoList.map(mapChatRoomUserDtoToDomain),
    messageList: mapMessageListDtoToDomain(dto.messageList),
    userInitReadList: dto.userInitReadList.map(mapUserLastReadMessageIdDtoToDomain),
  };
}
