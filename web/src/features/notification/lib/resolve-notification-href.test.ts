import { describe, expect, it } from "vitest";

import { resolveNotificationHref } from "./resolve-notification-href";

describe("resolveNotificationHref", () => {
  it("type이나 relatedId가 없으면 null을 반환해야 한다", () => {
    expect(resolveNotificationHref({})).toBeNull();
    expect(
      resolveNotificationHref({
        type: "POST",
        chatRoomUUID: "room-1",
      })
    ).toBeNull();
    expect(
      resolveNotificationHref({
        type: "LIGHTNING_MEETING",
        chatRoomUUID: "room-1",
      })
    ).toBeNull();
    expect(
      resolveNotificationHref({
        relatedId: "10",
        chatRoomUUID: "room-1",
      })
    ).toBeNull();
  });

  it("게시글 id가 있으면 게시글 상세 경로를 반환해야 한다", () => {
    expect(
      resolveNotificationHref({ type: "POST", relatedId: "10" })
    ).toBe("/board/d/10");
    expect(
      resolveNotificationHref({ type: " POST ", relatedId: "10" })
    ).toBe("/board/d/10");
  });

  it("게시글 id가 숫자가 아니면 null을 반환해야 한다", () => {
    expect(
      resolveNotificationHref({ type: "POST", relatedId: "pk" })
    ).toBeNull();
    expect(
      resolveNotificationHref({ type: "POST", relatedId: "0" })
    ).toBeNull();
  });

  it("공연 publicKey가 있으면 공연 상세 경로를 반환해야 한다", () => {
    expect(
      resolveNotificationHref({
        type: "PERFORMANCE",
        relatedId: "pk 8",
      })
    ).toBe("/board/promote/d/pk%208");
  });

  it("모임 성사 알림은 채팅방 경로를 반환해야 한다", () => {
    expect(
      resolveNotificationHref({
        type: "LIGHTNING_MEETING",
        relatedId: "12",
        chatRoomUUID: "room/1",
      })
    ).toBe("/chats/r/room%2F1");
  });

  it("채팅방 UUID가 공백이면 번개 페이지 경로를 반환해야 한다", () => {
    expect(
      resolveNotificationHref({
        type: "LIGHTNING_MEETING",
        relatedId: "12",
        chatRoomUUID: "   ",
      })
    ).toBe("/lightning");
  });

  it("채팅방 UUID가 없으면 번개 페이지 경로를 반환해야 한다", () => {
    expect(
      resolveNotificationHref({
        type: "LIGHTNING_MEETING",
        relatedId: "12",
      })
    ).toBe("/lightning");
  });

  it("알 수 없는 type이면 null을 반환해야 한다", () => {
    expect(
      resolveNotificationHref({ type: "CHAT", relatedId: "1" })
    ).toBeNull();
  });
});
