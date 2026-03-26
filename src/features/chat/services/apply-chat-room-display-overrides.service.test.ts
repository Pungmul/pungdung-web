import { describe, expect, it } from "vitest";

import type { ChatRoomInfo, ChatRoomListItem } from "../types";

import {
  applyChatRoomDisplayOverrideToInfo,
  applyChatRoomDisplayOverridesToList,
} from "./apply-chat-room-display-overrides.service";

const room = (overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: null,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "서버 방",
  profileImageUrl: "/server.png",
  group: false,
  ...overrides,
});

describe("applyChatRoomDisplayOverrides", () => {
  it("roomId 기준 로컬 이름/이미지 override를 목록 표시값에 우선 적용한다", () => {
    const result = applyChatRoomDisplayOverridesToList(
      [room(), room({ chatRoomUUID: "room-2", roomName: "다른 방" })],
      {
        "room-1": {
          roomName: "로컬 방",
          profileImageUrl: "data:image/png;base64,local",
        },
      }
    );

    expect(result[0]?.roomName).toBe("로컬 방");
    expect(result[0]?.profileImageUrl).toBe("data:image/png;base64,local");
    expect(result[1]?.roomName).toBe("다른 방");
  });

  it("로컬 override가 없으면 query/cache 표시값을 그대로 둔다", () => {
    const result = applyChatRoomDisplayOverridesToList([room()], {});

    expect(result[0]?.roomName).toBe("서버 방");
    expect(result[0]?.profileImageUrl).toBe("/server.png");
  });

  it("방 상세 정보도 로컬 override를 query 데이터보다 우선한다", () => {
    const info: ChatRoomInfo = {
      chatRoomUUID: "room-1",
      roomName: "서버 방",
      profileImageUrl: "/server.png",
      group: false,
    };

    const result = applyChatRoomDisplayOverrideToInfo(info, {
      roomName: "로컬 방",
      profileImageUrl: null,
    });

    expect(result.roomName).toBe("로컬 방");
    expect(result.profileImageUrl).toBeNull();
  });
});
