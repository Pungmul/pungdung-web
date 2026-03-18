import { describe, expect, it } from "vitest";

import { unreadNotificationItemDtoSchema } from "./dto.schema";

describe("unreadNotificationItemDtoSchema", () => {
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

    const parsed = unreadNotificationItemDtoSchema.safeParse(raw);

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

    const parsed = unreadNotificationItemDtoSchema.safeParse(raw);

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

    const parsed = unreadNotificationItemDtoSchema.safeParse(raw);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.data).toBeNull();
  });
});
