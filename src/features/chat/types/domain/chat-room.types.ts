import type { User } from "@/features/user";

import type { MessageList } from "./chat-message.types";

export interface ChatRoomInfo {
  chatRoomUUID: string;
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

export interface UserLastReadMessageId {
  userId: number;
  lastReadMessageId: number | null;
}

export interface ChatRoom {
  chatRoomInfo: ChatRoomInfo;
  userInfoList: User[];
  messageList: MessageList;
  userInitReadList: UserLastReadMessageId[];
}

/** 채팅방 목록 한 줄(도메인). 목록 API DTO는 `ChatRoomListItemDto`. */
export interface ChatRoomListItem {
  chatRoomUUID: string;
  lastMessageTime: string | null;
  lastMessageContent: string | null;
  unreadCount: number | null;
  senderId: number | null;
  senderName: string | null;
  receiverId: number | null;
  receiverName: string | null;
  chatRoomMemberIds: number[];
  chatRoomMemberNames: string[];
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}
