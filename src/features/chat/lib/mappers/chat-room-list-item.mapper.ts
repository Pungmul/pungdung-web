import type { ChatRoomListItemDto } from "../../api/client/dto.schema";
import type { ChatRoomListItem } from "../../types/domain/chat-room.types";

export function mapChatRoomListItemDtoToDomain(
  dto: ChatRoomListItemDto
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

type ChatRoomListItemIndexedDBRecord = Omit<
  ChatRoomListItem,
  "isMuted" | "chatRoomMemberIds" | "chatRoomMemberNames"
> & {
  isMuted?: boolean;
  muted?: boolean;
  chatRoomMemberIds?: number[] | null;
  chatRoomMemberNames?: string[] | null;
};

export function mapChatRoomListItemIndexedDBToDomain(
  record: ChatRoomListItemIndexedDBRecord
): ChatRoomListItem {
  return {
    chatRoomUUID: record.chatRoomUUID,
    isMuted:
      typeof record.isMuted === "boolean"
        ? record.isMuted
        : Boolean(record.muted),
    lastMessageTime: record.lastMessageTime,
    lastMessageContent: record.lastMessageContent,
    unreadCount: record.unreadCount,
    senderId: record.senderId,
    senderName: record.senderName,
    receiverId: record.receiverId,
    receiverName: record.receiverName,
    chatRoomMemberIds: Array.isArray(record.chatRoomMemberIds)
      ? record.chatRoomMemberIds
      : [],
    chatRoomMemberNames: Array.isArray(record.chatRoomMemberNames)
      ? record.chatRoomMemberNames
      : [],
    roomName: record.roomName,
    profileImageUrl: record.profileImageUrl,
    group: record.group,
  };
}
