import type { ChatRoomListItemDto } from "../../api/client/dto.schema";
import type { ChatRoomListItem } from "../../types/chat-room.types";

export function mapChatRoomListItemDtoToDomain(
  dto: ChatRoomListItemDto,
): ChatRoomListItem {
  return {
    chatRoomUUID: dto.chatRoomUUID,
    isMuted: dto.isMuted,
    lastMessageTime: dto.lastMessageTime,
    lastMessageContent: dto.lastMessageContent,
    unreadCount: dto.unreadCount,
    senderId: dto.senderId,
    senderName: dto.senderName,
    receiverId: dto.receiverId,
    receiverName: dto.receiverName,
    chatRoomMemberIds: dto.chatRoomMemberIds,
    chatRoomMemberNames: dto.chatRoomMemberNames,
    roomName: dto.roomName,
    profileImageUrl: dto.profileImageUrl,
    group: dto.group,
  };
}
