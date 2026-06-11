import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { notificationPermissionStore } from "../../store/notification-permission.store";
import { useSyncFCMTokenWithPermission } from "./useSyncFCMTokenWithPermission";

const { fetchMyFCMTokensMock, invalidateFCMTokenMock, registerFCMTokenMock } =
  vi.hoisted(() => ({
    fetchMyFCMTokensMock: vi.fn(),
    invalidateFCMTokenMock: vi.fn(),
    registerFCMTokenMock: vi.fn(),
  }));

vi.mock("../../api/client", () => ({
  fetchMyFCMTokens: fetchMyFCMTokensMock,
  invalidateFCMToken: invalidateFCMTokenMock,
  registerFCMToken: registerFCMTokenMock,
}));

function setNotificationPermission(permission: NotificationPermission) {
  class NotificationStub {
    static permission: NotificationPermission = permission;
  }
  Reflect.set(window, "Notification", NotificationStub);
}

describe("useSyncFCMTokenWithPermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setNotificationPermission("granted");
    notificationPermissionStore.setState({
      permission: "default",
      permissionHydrated: false,
      enabled: false,
      togglePending: false,
      deviceToken: null,
    });
  });

  it("permission hydration 전에는 persisted enabled=true를 강제로 false로 내리지 않아야 한다", async () => {
    fetchMyFCMTokensMock.mockResolvedValue(["token-1"]);

    notificationPermissionStore.setState({
      enabled: true,
      permission: "default",
      permissionHydrated: false,
      deviceToken: "token-1",
    });

    renderHook(() => useSyncFCMTokenWithPermission());

    await waitFor(() => {
      expect(notificationPermissionStore.getState().enabled).toBe(true);
    });
    expect(fetchMyFCMTokensMock).not.toHaveBeenCalled();

    notificationPermissionStore.getState().setPermission("granted");
    notificationPermissionStore.getState().setPermissionHydrated(true);

    await waitFor(() => {
      expect(fetchMyFCMTokensMock).toHaveBeenCalledTimes(1);
    });
    expect(notificationPermissionStore.getState().enabled).toBe(true);
  });

  it("재등록 실패 시 enabled/deviceToken 상태를 함께 정정해야 한다", async () => {
    fetchMyFCMTokensMock.mockResolvedValue([]);
    registerFCMTokenMock.mockResolvedValue(false);
    invalidateFCMTokenMock.mockResolvedValue(true);

    notificationPermissionStore.setState({
      enabled: true,
      permission: "granted",
      permissionHydrated: true,
      deviceToken: "token-1",
    });

    renderHook(() => useSyncFCMTokenWithPermission());

    await waitFor(() => {
      expect(registerFCMTokenMock).toHaveBeenCalledWith(
        "token-1",
        navigator.userAgent
      );
    });

    await waitFor(() => {
      const state = notificationPermissionStore.getState();
      expect(state.enabled).toBe(false);
      expect(state.deviceToken).toBeNull();
    });

    expect(invalidateFCMTokenMock).not.toHaveBeenCalled();
  });
});
