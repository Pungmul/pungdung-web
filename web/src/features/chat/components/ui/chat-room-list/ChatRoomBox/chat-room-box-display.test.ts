import { describe, expect, it } from "vitest";

import {
  chatRoomBoxMemberCount,
  chatRoomBoxTypeLabel,
} from "./chat-room-box-display";

describe("chatRoomBoxTypeLabel", () => {
  it("NORMAL은 태그가 없다", () => {
    expect(chatRoomBoxTypeLabel("NORMAL")).toBeNull();
  });

  it("번개와 공연 라벨을 반환한다", () => {
    expect(chatRoomBoxTypeLabel("LIGHTNING")).toBe("번개");
    expect(chatRoomBoxTypeLabel("PERFORMANCE")).toBe("공연");
  });
});

describe("chatRoomBoxMemberCount", () => {
  it("1:1 일반 방은 인원을 숨긴다", () => {
    expect(
      chatRoomBoxMemberCount({
        type: "NORMAL",
        group: false,
        chatRoomMemberIds: [1, 2],
      })
    ).toBeNull();
  });

  it("그룹 일반 방과 번개, 공연은 멤버 수를 반환한다", () => {
    expect(
      chatRoomBoxMemberCount({
        type: "NORMAL",
        group: true,
        chatRoomMemberIds: [1, 2, 3],
      })
    ).toBe(3);
    expect(
      chatRoomBoxMemberCount({
        type: "LIGHTNING",
        group: false,
        chatRoomMemberIds: [1],
      })
    ).toBe(1);
    expect(
      chatRoomBoxMemberCount({
        type: "PERFORMANCE",
        group: true,
        chatRoomMemberIds: [1, 2],
      })
    ).toBe(2);
  });
});
