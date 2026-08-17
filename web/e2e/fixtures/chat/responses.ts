import { okEnvelope } from "../envelope";

export const E2E_CHAT_ROOM_A = "e2e-room-a";
export const E2E_CHAT_ROOM_B = "e2e-room-b";
export const E2E_CREATED_CHAT_ROOM = "e2e-created-chat-room";
export const E2E_CHAT_USERNAME = "e2e-user";
export const E2E_OTHER_USERNAME = "other-user";
export const E2E_HISTORY_TEXT = "이전 대화입니다.";
export const E2E_INCOMING_TEXT = "지금 받은 메시지";
export const E2E_SEND_TEXT = "내가 보낸 메시지";
export const E2E_RETRY_TEXT = "재전송할 메시지";

export const e2eChatProfileImage = {
  id: 1,
  originalFilename: "profile.png",
  convertedFileName: "profile.png",
  fullFilePath: "/favicon.ico",
  fileType: "image/png",
  fileSize: 1,
  createdAt: "2027-12-01T00:00:00.000Z",
};

export const e2eChatSelfUser = {
  userId: 1,
  username: E2E_CHAT_USERNAME,
  name: "E2E User",
  clubName: "풍물패",
  groupName: "서울대학교",
  profileImage: e2eChatProfileImage,
};

export const e2eChatOtherUser = {
  userId: 2,
  username: E2E_OTHER_USERNAME,
  name: "상대 유저",
  clubName: "상대패",
  groupName: "서울대학교",
  profileImage: e2eChatProfileImage,
};

export function chatTextMessageDto(params: {
  id: number;
  roomId: string;
  content: string;
  senderUsername: string;
  clientId?: string | null;
  createdAt?: string;
}) {
  return {
    id: params.id,
    clientId: params.clientId ?? null,
    senderUsername: params.senderUsername,
    content: params.content,
    chatType: "TEXT" as const,
    imageUrlList: null,
    chatRoomUUID: params.roomId,
    createdAt: params.createdAt ?? "2027-12-01 00:00:00",
  };
}

export function chatRoomInfoResponse(params: {
  roomId: string;
  roomName: string;
  messages?: ReturnType<typeof chatTextMessageDto>[];
}) {
  const messages = params.messages ?? [];
  return okEnvelope({
    chatRoomInfo: {
      chatRoomUUID: params.roomId,
      roomName: params.roomName,
      profileImageUrl: null,
      group: true,
    },
    userInfoList: [e2eChatSelfUser, e2eChatOtherUser],
    messageList: {
      messages,
      hasMore: false,
      nextCursor: null,
    },
    userInitReadList: [
      { userId: e2eChatSelfUser.userId, lastReadMessageId: messages.at(-1)?.id ?? null },
      { userId: e2eChatOtherUser.userId, lastReadMessageId: messages.at(-1)?.id ?? null },
    ],
  });
}

export function chatLogResponse(
  messages: ReturnType<typeof chatTextMessageDto>[]
) {
  return okEnvelope({
    messages,
    hasMore: false,
    nextCursor: null,
  });
}

export function chatRoomListResponse(
  rooms: Array<{ roomId: string; roomName: string; lastMessage?: string | null }>
) {
  return okEnvelope({
    list: rooms.map((room) => ({
      chatRoomUUID: room.roomId,
      isMuted: false,
      lastMessageTime: "2027-12-01T00:00:00.000Z",
      lastMessageContent: room.lastMessage ?? null,
      unreadCount: 0,
      senderId: e2eChatOtherUser.userId,
      senderName: e2eChatOtherUser.name,
      receiverId: e2eChatSelfUser.userId,
      receiverName: e2eChatSelfUser.name,
      chatRoomMemberIds: [e2eChatSelfUser.userId, e2eChatOtherUser.userId],
      chatRoomMemberNames: [e2eChatSelfUser.name, e2eChatOtherUser.name],
      roomName: room.roomName,
      profileImageUrl: null,
      group: true,
    })),
  });
}

export function chatNotificationStateResponse() {
  return okEnvelope({
    isMuted: false,
    globalEnabled: true,
  });
}

export function chatTimelineEnvelope(params: {
  id: number;
  roomId: string;
  content: string;
  senderUsername: string;
  clientId?: string | null;
}) {
  return {
    messageLogId: params.id,
    domainType: "CHAT",
    businessIdentifier: params.roomId,
    identifier: String(params.id),
    stompDest: `/sub/chat/message/${params.roomId}`,
    content: {
      id: params.id,
      clientId: params.clientId ?? null,
      senderUsername: params.senderUsername,
      content: params.content,
      chatType: "CHAT",
      imageUrl: null,
      chatRoomUUID: params.roomId,
      createdAt: "2027-12-01 12:00:00",
    },
  };
}

