import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync("public/pungdung-fcm-background.template.js", "utf8");

function receiveBackgroundMessage(payload: unknown) {
  const showNotification = vi.fn().mockResolvedValue(undefined);
  const onBackgroundMessage = vi.fn<(handler: (data: unknown) => unknown) => void>();
  runInNewContext(source, {
    firebase: { initializeApp: vi.fn(), messaging: () => ({ onBackgroundMessage }) },
    self: { registration: { showNotification } },
    console: { log: vi.fn() },
  });
  const handler = onBackgroundMessage.mock.calls[0]?.[0];
  if (!handler) throw new Error("백그라운드 메시지 핸들러가 등록되지 않았습니다.");
  const result: unknown = handler(payload);
  return { showNotification, result };
}

describe("FCM 백그라운드 알림 표시", () => {
  it("data-only 알림에 이동 정보를 보존하고 표시 완료까지 기다린다", async () => {
    const data = { title: "새 글", body: "내용", type: "POST", relatedId: "30" };
    const { showNotification, result } = receiveBackgroundMessage({ data });
    expect(showNotification).toHaveBeenCalledWith("새 글", expect.objectContaining({
      body: "내용", data: { pungdungFCM: data },
    }));
    expect(result).toBe(showNotification.mock.results[0]?.value);
    await result;
  });

  it("Firebase가 자동 표시하는 알림을 중복 생성하지 않는다", () => {
    const { showNotification } = receiveBackgroundMessage({
      notification: { title: "제목만 있는 자동 알림" },
      data: { title: "제목", body: "내용", type: "POST", relatedId: "30" },
    });
    expect(showNotification).not.toHaveBeenCalled();
  });
});
