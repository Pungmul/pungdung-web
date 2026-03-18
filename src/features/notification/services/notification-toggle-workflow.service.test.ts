import { describe, expect, it, vi } from "vitest";

import {
  disableNotificationWorkflow,
  enableNotificationWorkflow,
} from "./notification-toggle-workflow.service";

describe("enableNotificationWorkflow", () => {
  it("권한이 granted가 아니면 비활성 상태를 유지하고 register API를 호출하지 않아야 한다", async () => {
    const registerFCMToken = vi.fn().mockResolvedValue(true);

    const result = await enableNotificationWorkflow({
      requestFCMToken: async () => ({
        permission: "denied",
        token: null,
      }),
      registerFCMToken,
      deviceInfo: "test-agent",
    });

    expect(result).toEqual({
      enabled: false,
      permission: "denied",
      deviceToken: null,
    });
    expect(registerFCMToken).not.toHaveBeenCalled();
  });

  it("권한 granted + 토큰 존재 + 서버 등록 성공이면 활성 상태여야 한다", async () => {
    const registerFCMToken = vi.fn().mockResolvedValue(true);

    const result = await enableNotificationWorkflow({
      requestFCMToken: async () => ({
        permission: "granted",
        token: "token-1",
      }),
      registerFCMToken,
      deviceInfo: "test-agent",
    });

    expect(result).toEqual({
      enabled: true,
      permission: "granted",
      deviceToken: "token-1",
    });
    expect(registerFCMToken).toHaveBeenCalledWith("token-1", "test-agent");
  });

  it("권한 granted여도 토큰이 없으면 비활성 상태를 유지하고 register API를 호출하지 않아야 한다", async () => {
    const registerFCMToken = vi.fn().mockResolvedValue(true);

    const result = await enableNotificationWorkflow({
      requestFCMToken: async () => ({
        permission: "granted",
        token: null,
      }),
      registerFCMToken,
      deviceInfo: "test-agent",
    });

    expect(result).toEqual({
      enabled: false,
      permission: "granted",
      deviceToken: null,
    });
    expect(registerFCMToken).not.toHaveBeenCalled();
  });

  it("등록 실패 시 enabled=false, deviceToken=null 정책을 유지해야 한다", async () => {
    const registerFCMToken = vi.fn().mockResolvedValue(false);

    const result = await enableNotificationWorkflow({
      requestFCMToken: async () => ({
        permission: "granted",
        token: "token-1",
      }),
      registerFCMToken,
      deviceInfo: "test-agent",
    });

    expect(result).toEqual({
      enabled: false,
      permission: "granted",
      deviceToken: null,
    });
    expect(registerFCMToken).toHaveBeenCalledWith("token-1", "test-agent");
  });
});

describe("disableNotificationWorkflow", () => {
  it("토큰이 있으면 invalidate API를 호출하고 성공 시 비활성 상태가 되어야 한다", async () => {
    const invalidateFCMToken = vi.fn().mockResolvedValue(true);

    const result = await disableNotificationWorkflow({
      deviceToken: "token-1",
      invalidateFCMToken,
    });

    expect(invalidateFCMToken).toHaveBeenCalledWith("token-1");
    expect(result).toEqual({
      enabled: false,
      deviceToken: null,
    });
  });

  it("invalidate 실패 시 enabled=true, 기존 token 유지 정책을 반환해야 한다", async () => {
    const invalidateFCMToken = vi.fn().mockResolvedValue(false);

    const result = await disableNotificationWorkflow({
      deviceToken: "token-1",
      invalidateFCMToken,
    });

    expect(invalidateFCMToken).toHaveBeenCalledWith("token-1");
    expect(result).toEqual({
      enabled: true,
      deviceToken: "token-1",
    });
  });
});
