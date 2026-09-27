import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

import { resolveNotificationHref } from "@/features/notification/lib/resolve-notification-href";

const source = readFileSync("public/service-worker/notification-navigation.js", "utf8");

function clickNotification(data: unknown) {
  const open = vi.fn().mockResolvedValue(undefined);
  const event = {
    action: "",
    notification: { data, close: vi.fn() },
    stopImmediatePropagation: vi.fn(),
    waitUntil: vi.fn(),
  };
  runInNewContext(source, {
    self: {
      pungdungWindowNavigation: { open },
      addEventListener: (_name: string, listener: (value: typeof event) => void) => listener(event),
    },
  });
  return { open, event };
}

describe("FCM 알림 클릭 경로", () => {
  it.each([
    { type: "POST", relatedId: "30" },
    { type: "PERFORMANCE", relatedId: "public key" },
    { type: "LIGHTNING_MEETING", relatedId: "12" },
    { type: "LIGHTNING_MEETING", relatedId: "12", chatRoomUUID: "room/12" },
  ])("알림 목록과 동일한 목적지를 사용한다: %o", (data) => {
    const { open } = clickNotification({ FCM_MSG: { data } });
    expect(open).toHaveBeenCalledWith({
      href: resolveNotificationHref(data),
      parents: data.type === "POST" ? ["/home", "/board/main"] : ["/home"],
    });
  });

  it("data-only 일반 채팅은 relatedId 없이 UUID로 연결한다", () => {
    const { open, event } = clickNotification({ pungdungFCM: { chatRoomUUID: "room-1" } });
    expect(open).toHaveBeenCalledWith({ href: "/chats/r/room-1", parents: ["/home"] });
    expect(event.notification.close).toHaveBeenCalledOnce();
    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  });

  it.each([{ type: "POST" }, {}, { type: "LIGHTNING_MEETING", chatRoomUUID: "room-1" }])(
    "이동 정보가 부족한 알림은 목적지가 없다: %o", (data) => {
      expect(clickNotification({ FCM_MSG: { data } }).open).toHaveBeenCalledWith(null);
    }
  );

  it("다른 알림 핸들러는 가로채지 않는다", () => {
    const { open, event } = clickNotification({ other: true });
    expect(open).not.toHaveBeenCalled();
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });
});
