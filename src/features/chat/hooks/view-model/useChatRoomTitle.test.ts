import { describe, expect, it } from "vitest";

import type { ChatRoom, ChatRoomListItem } from "../../types/domain/chat-room.types";

import { getChatRoomTitle, getChatRoomTitleFromListItem } from "./useChatRoomTitle";

const chatRoom = (group: boolean, roomName: string, memberCount: number): ChatRoom =>
  ({
    chatRoomInfo: {
      chatRoomUUID: "r",
      roomName,
      profileImageUrl: null,
      group,
    },
    userInfoList: Array.from({ length: memberCount }, (_, i) => ({ userId: i })),
    messageList: { list: [], hasMore: false, nextCursor: null },
    userInitReadList: [],
  }) as unknown as ChatRoom;

describe("getChatRoomTitle", () => {
  it("그룹이면 방 이름 뒤에 인원 수", () => {
    expect(getChatRoomTitle(chatRoom(true, "팀", 3))).toBe("팀 (3)");
  });

  it("1:1이면 방 이름만", () => {
    expect(getChatRoomTitle(chatRoom(false, "상대", 2))).toBe("상대");
  });
});

describe("getChatRoomTitleFromListItem", () => {
  const item = (over: Partial<ChatRoomListItem>): ChatRoomListItem => ({
    chatRoomUUID: "r",
    isMuted: false,
    lastMessageTime: null,
    lastMessageContent: null,
    unreadCount: 0,
    senderId: null,
    senderName: null,
    receiverId: null,
    receiverName: null,
    chatRoomMemberIds: [1, 2, 3],
    chatRoomMemberNames: [],
    roomName: "이름",
    profileImageUrl: null,
    group: true,
    ...over,
  });

  it("그룹이면 member id 개수로 표시", () => {
    expect(getChatRoomTitleFromListItem(item({}))).toBe("이름 (3)");
  });

  it("1:1이면 roomName만", () => {
    expect(getChatRoomTitleFromListItem(item({ group: false }))).toBe("이름");
  });
});
