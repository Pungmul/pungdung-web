import { describe, expect, it } from "vitest";

import { notificationItemDtoSchema } from "./dto.schema";

describe("notificationItemDtoSchema", () => {
  it("id가 문자열이면 숫자로 변환하고 data JSON 문자열을 객체로 파싱해야 한다", () => {
    const raw = {
      id: "7",
      receiverId: 1,
      token: "tok",
      title: "T",
      body: null,
      data: '{"sentAt":"2024-06-01T00:00:00.000Z","unreadCount":"3"}',
      isRead: false,
      sentAt: "2024-06-01T01:00:00.000Z",
      status: "s",
      domainType: "d",
    };

    const parsed = notificationItemDtoSchema.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.id).toBe(7);
    expect(parsed.data.data).toEqual({
      sentAt: "2024-06-01T00:00:00.000Z",
      unreadCount: "3",
    });
  });

  it("data 문자열이 잘못된 JSON이면 data를 null로 설정해야 한다", () => {
    const raw = {
      id: 1,
      receiverId: 1,
      token: "tok",
      title: "T",
      isRead: false,
      sentAt: "2024-01-01T00:00:00.000Z",
      status: "s",
      domainType: "d",
      data: "{not-json",
    };

    const parsed = notificationItemDtoSchema.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.data).toBeNull();
  });

  it("data가 공백 문자열뿐이면 data를 null로 설정해야 한다", () => {
    const raw = {
      id: 1,
      receiverId: 1,
      token: "tok",
      title: "T",
      isRead: false,
      sentAt: "2024-01-01T00:00:00.000Z",
      status: "s",
      domainType: "d",
      data: "   ",
    };

    const parsed = notificationItemDtoSchema.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.data).toBeNull();
  });

  it("항목과 data의 type, relatedId를 유지해야 한다", () => {
    const raw = {
      id: 3,
      receiverId: 1,
      token: "tok",
      title: "모임 성사",
      isRead: false,
      sentAt: "2024-01-01T00:00:00.000Z",
      status: "s",
      domainType: "d",
      type: "LIGHTNING_MEETING",
      relatedId: "12",
      data: '{"type":"LIGHTNING_MEETING","relatedId":"12","chatRoomUUID":"room-12"}',
    };

    const parsed = notificationItemDtoSchema.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.type).toBe("LIGHTNING_MEETING");
    expect(parsed.data.relatedId).toBe("12");
    expect(parsed.data.data).toEqual({
      type: "LIGHTNING_MEETING",
      relatedId: "12",
      chatRoomUUID: "room-12",
    });
  });

  it("messages 응답처럼 data 없이 최상위 필드만 있어도 통과해야 한다", () => {
    const parsed = notificationItemDtoSchema.safeParse({
      id: 123,
      title: "새 댓글",
      body: "댓글 내용",
      type: "POST",
      relatedId: "45",
      isRead: false,
      sentAt: "2026-09-28T14:03:21",
      domainType: "POST",
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.id).toBe(123);
    expect(parsed.data.isRead).toBe(false);
    expect(parsed.data.type).toBe("POST");
    expect(parsed.data.relatedId).toBe("45");
  });
});
