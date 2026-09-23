import type {
  ChatRoomListItem,
  ChatRoomType,
} from "../../../types/chat-room.types";

type ChatRoomListItemIndexedDBRecord = Omit<
  ChatRoomListItem,
  | "isMuted"
  | "chatRoomMemberIds"
  | "chatRoomMemberNames"
  | "type"
  | "relatedId"
> & {
  isMuted?: boolean;
  muted?: boolean;
  chatRoomMemberIds?: number[] | null;
  chatRoomMemberNames?: string[] | null;
  type?: ChatRoomType;
  relatedId?: number | string | null;
};

export function mapChatRoomListItemIndexedDBToDomain(
  record: ChatRoomListItemIndexedDBRecord,
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
    type: record.type ?? "NORMAL",
    relatedId: record.relatedId ?? null,
  };
}
