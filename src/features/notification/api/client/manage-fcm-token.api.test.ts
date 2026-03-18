import { beforeEach, describe, expect, it, vi } from "vitest";

import { invalidateFCMToken } from "./manage-fcm-token.api";

describe("invalidateFCMToken", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("/api/notification/token에 DELETE 요청으로 JSON body와 credentials를 포함해 호출한다", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const result = await invalidateFCMToken("token-1");

    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/notification/token", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token: "token-1" }),
    });
  });

  it("응답이 2xx가 아니면 false를 반환한다", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 })
    );

    const result = await invalidateFCMToken("token-1");

    expect(result).toBe(false);
  });

  it("요청 실패 시 false를 반환한다", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network error"));
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const result = await invalidateFCMToken("token-1");

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
