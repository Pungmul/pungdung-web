import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Toast } from "@/shared/store";

import {
  NOTIFICATION_TOGGLE_DISABLED_TOAST_TITLE,
  NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE,
} from "../../constants";
import { notificationPermissionStore } from "../../store/notification-permission.store";
import { useNotificationToggleAction } from "./useNotificationToggleAction";

const {
  requestFCMTokenMock,
  registerFCMTokenMock,
  invalidateFCMTokenMock,
} = vi.hoisted(() => ({
  requestFCMTokenMock: vi.fn(),
  registerFCMTokenMock: vi.fn(),
  invalidateFCMTokenMock: vi.fn(),
}));

vi.mock("../../services/request-permission.service", () => ({
  requestFCMToken: requestFCMTokenMock,
}));

vi.mock("../../api/client", () => ({
  registerFCMToken: registerFCMTokenMock,
  invalidateFCMToken: invalidateFCMTokenMock,
}));

describe("useNotificationToggleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Toast, "show");
    localStorage.clear();
    notificationPermissionStore.setState({
      permission: "default",
      permissionHydrated: false,
      enabled: false,
      togglePending: false,
      deviceToken: null,
    });
  });

  it("토글 활성화 성공 시 완료 토스트를 추가해야 한다", async () => {
    requestFCMTokenMock.mockResolvedValue({
      permission: "granted",
      token: "token-1",
    });
    registerFCMTokenMock.mockResolvedValue(true);

    const { result } = renderHook(() => useNotificationToggleAction());
    const enabled = await result.current(true);

    expect(enabled).toBe(true);
    expect(Toast.show).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith({
      message: NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE,
    });
  });

  it("토글 비활성화 성공 시 해제 토스트를 추가해야 한다", async () => {
    notificationPermissionStore.setState({
      enabled: true,
      deviceToken: "token-1",
    });
    invalidateFCMTokenMock.mockResolvedValue(true);

    const { result } = renderHook(() => useNotificationToggleAction());
    const enabled = await result.current(false);

    expect(enabled).toBe(false);
    expect(Toast.show).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith({
      message: NOTIFICATION_TOGGLE_DISABLED_TOAST_TITLE,
    });
  });

  it("토글 비활성화 실패 시 토스트를 추가하지 않고 enabled=true를 유지해야 한다", async () => {
    notificationPermissionStore.setState({
      enabled: true,
      deviceToken: "token-1",
    });
    invalidateFCMTokenMock.mockResolvedValue(false);

    const { result } = renderHook(() => useNotificationToggleAction());
    const enabled = await result.current(false);

    expect(enabled).toBe(true);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("활성화 실패 시 토스트를 추가하지 않아야 한다", async () => {
    requestFCMTokenMock.mockResolvedValue({
      permission: "denied",
      token: null,
    });

    const { result } = renderHook(() => useNotificationToggleAction());
    const enabled = await result.current(true);

    expect(enabled).toBe(false);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("pending 중에는 중복 토글 실행을 막아야 한다", async () => {
    let resolveRequest!: (value: {
      permission: NotificationPermission;
      token: string | null;
    }) => void;

    requestFCMTokenMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve as (value: {
            permission: NotificationPermission;
            token: string | null;
          }) => void;
        })
    );
    registerFCMTokenMock.mockResolvedValue(true);

    const { result } = renderHook(() => useNotificationToggleAction());

    const firstPromise = result.current(true);
    const secondPromise = result.current(true);

    expect(notificationPermissionStore.getState().togglePending).toBe(true);
    expect(requestFCMTokenMock).toHaveBeenCalledTimes(1);

    resolveRequest({
      permission: "granted",
      token: "token-1",
    });

    await firstPromise;
    await secondPromise;

    expect(registerFCMTokenMock).toHaveBeenCalledTimes(1);
    expect(notificationPermissionStore.getState().enabled).toBe(true);
    expect(notificationPermissionStore.getState().togglePending).toBe(false);
  });
});
