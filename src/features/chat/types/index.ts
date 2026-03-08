// Type guards
export * from "./guards";
// Pending message types
export * from "./pending-message.types";

import type { User } from "@/features/user";

export interface ChatRoomInfo {
  chatRoomUUID: string;
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

export type Message =
  | {
      id: number | string;
      senderUsername: string;
      content: string;
      chatType: "TEXT";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: null;
      chatType: "IMAGE";
      imageUrlList: string[];
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: null;
      chatType: "LEAVE";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    }
  | {
      id: number | string;
      senderUsername: string;
      content: string;
      chatType: "JOIN";
      imageUrlList: null;
      chatRoomUUID: string;
      createdAt: string;
    };

export interface ChatMessage {
  messageLogId: number;
  domainType: "CHAT" | "IMAGE";
  businessIdentifier: string;
  identifier: string;
  stompDest: string;
  content: {
    id: number;
    senderUsername: string;
    content: string;
    chatType: "CHAT" | "ENTER" | "LEAVE";
    imageUrl: string | null;
    chatRoomUUID: string;
    createdAt: string;
  };
}

export interface MessageList {
  total: number;
  list: Message[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}

export interface ChatRoomListItemDto {
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

export type ChatMessageDto = MessageList;

export interface UserLastReadMessageId {
  userId: number;
  lastReadMessageId: number | null;
}

export interface ChatRoomDto {
  chatRoomInfo: ChatRoomInfo;
  userInfoList: User[];
  messageList: MessageList;
  userInitReadList: UserLastReadMessageId[];
}

// {
//   "messageLogId":189,
//   "domainType":"CHAT",
//   "businessIdentifier":"alarm",
//   "identifier":"3b928aa1-26f7-418f-ba4b-e7a9360453eb",
//   "stompDest":"/sub/chat/alarm/3b928aa1-26f7-418f-ba4b-e7a9360453eb",
//   "content":"{\"content\":\"김진현 님이 나갔습니다.\"}"
// }

export interface AlarmMessage {
  messageLogId: number;
  domainType: "CHAT";
  businessIdentifier: string;
  identifier: string;
  stompDest: string;
  content: string;
}

export interface ChatRoomUpdateMessage {
  chatRoomUUID: string;
  content: string | null;
  timestamp: string;
  /** 예: 새 메시지 알림은 미포함, 읽음 처리는 `"READ"` */
  type?: string;
  unreadCount?: number | null;
}

/**
 * 서버에서 내려주는 읽음 처리 STOMP 메시지 (`/sub/chat/read/:roomId`).
 * `content.messageIds`가 비어 있으면 클라이언트가 메시지 목록의 최신 ID로 보완한다.
 */
export interface ReadSocketMessage {
  messageLogId: number;
  domainType: string;
  businessIdentifier: string;
  /** chatRoomUUID */
  identifier: string;
  stompDest: string;
  content: {
    userId: number;
    messageIds: number[];
    readAt: string;
  };
}
