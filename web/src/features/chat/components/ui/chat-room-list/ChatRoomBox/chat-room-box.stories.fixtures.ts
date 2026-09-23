import type { ChatRoomListItem } from "../../../../types";

function memberIds(count: number) {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function room(
  overrides: Partial<ChatRoomListItem> &
    Pick<ChatRoomListItem, "chatRoomUUID" | "roomName">
): ChatRoomListItem {
  return {
    isMuted: false,
    lastMessageTime: "2026-09-27T03:00:00.000Z",
    lastMessageContent: "최신 메시지",
    unreadCount: 0,
    senderId: null,
    senderName: null,
    receiverId: null,
    receiverName: null,
    chatRoomMemberIds: [],
    chatRoomMemberNames: [],
    profileImageUrl: null,
    group: false,
    type: "NORMAL",
    relatedId: null,
    ...overrides,
  };
}

export const personalRoom = room({
  chatRoomUUID: "personal",
  roomName: "강윤호",
  lastMessageContent: "내일 연습 몇 시야?",
});

export const normalGroupRoom = room({
  chatRoomUUID: "normal-group",
  roomName: "이님의 모임",
  group: true,
  chatRoomMemberIds: memberIds(8),
  unreadCount: 1,
});

export const lightningRoom = room({
  chatRoomUUID: "lightning",
  roomName: "방 이름",
  type: "LIGHTNING",
  relatedId: 12,
  group: true,
  chatRoomMemberIds: memberIds(12),
  isMuted: true,
});

export const performanceRoom = room({
  chatRoomUUID: "performance",
  roomName: "방 이름",
  type: "PERFORMANCE",
  relatedId: "pk-8",
  group: true,
  chatRoomMemberIds: memberIds(8),
});

export const longTitleRoom = room({
  chatRoomUUID: "long-title",
  roomName: "아주 긴 번개 모임 이름이 한 줄을 넘어가면 말줄임이 된다",
  type: "LIGHTNING",
  relatedId: 3,
  group: true,
  chatRoomMemberIds: memberIds(4),
  lastMessageTime: null,
  lastMessageContent: null,
});

export const sampleRooms = [
  personalRoom,
  normalGroupRoom,
  lightningRoom,
  performanceRoom,
  longTitleRoom,
];
