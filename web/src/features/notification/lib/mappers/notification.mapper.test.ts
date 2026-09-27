import { describe, expect, it } from "vitest";

import type { NotificationItemDto } from "../../api/client/dto.schema";
import { toNotificationData } from ".";

function baseDto(
  overrides: Partial<NotificationItemDto> = {}
): NotificationItemDto {
  return {
    id: 42,
    title: "Hello",
    body: "World",
    data: null,
    isRead: false,
    sentAt: "2024-01-02T03:04:05.000Z",
    domainType: "chat",
    ...overrides,
  };
}

describe("toNotificationData", () => {
  it("body가 null이면 본문을 빈 문자열로 채우고 logId를 id로 반환해야 한다", () => {
    const dto = baseDto({ body: null });

    const result = toNotificationData(dto);

    expect(result.logId).toBe(42);
    expect(result.title).toBe("Hello");
    expect(result.body).toBe("");
    expect(result.href).toBeNull();
    expect(result.isRead).toBe(false);
    expect(result.linkType).toBe("chat");
    expect(result.receivedAt.toISOString()).toBe("2024-01-02T03:04:05.000Z");
  });

  it("sentAt이 둘 다 유효하면 최상위 dto.sentAt을 우선 사용해야 한다", () => {
    const dto = baseDto({
      sentAt: "2024-02-01T00:00:00.000Z",
      data: { sentAt: "2024-03-01T00:00:00.000Z" },
    });

    const result = toNotificationData(dto);

    expect(result.receivedAt.toISOString()).toBe("2024-02-01T00:00:00.000Z");
  });

  it("런타임에서 최상위 sentAt이 비어 있으면 data.sentAt을 사용해야 한다", () => {
    // Runtime payloads may omit sentAt even when the Zod DTO type marks it required.
    const dto = {
      ...baseDto(),
      sentAt: undefined,
      data: { sentAt: "2024-05-10T12:00:00.000Z" },
    } as unknown as NotificationItemDto;

    const result = toNotificationData(dto);

    expect(result.receivedAt.toISOString()).toBe("2024-05-10T12:00:00.000Z");
  });

  it("sentAt 값들이 모두 잘못되면 epoch Date를 반환해야 한다", () => {
    const dto = baseDto({
      sentAt: "not-a-date",
      data: { sentAt: "also-bad" },
    });

    const result = toNotificationData(dto);

    expect(result.receivedAt.getTime()).toBe(0);
  });

  it("항목 값이 없으면 data의 type, relatedId, chatRoomUUID를 써야 한다", () => {
    const result = toNotificationData(
      baseDto({
        data: {
          type: "LIGHTNING_MEETING",
          relatedId: "9",
          chatRoomUUID: "room-9",
        },
      })
    );

    expect(result.href).toBe("/chats/r/room-9");
  });

  it("항목 type과 data.relatedId를 각각 조합해야 한다", () => {
    const result = toNotificationData(
      baseDto({
        type: "POST",
        data: { relatedId: "8" },
      })
    );

    expect(result.href).toBe("/board/d/8");
  });

  it("항목 relatedId가 공백이면 data.relatedId를 써야 한다", () => {
    const result = toNotificationData(
      baseDto({
        type: "PERFORMANCE",
        relatedId: "  ",
        data: { relatedId: "pk-1" },
      })
    );

    expect(result.href).toBe("/board/promote/d/pk-1");
  });
});
