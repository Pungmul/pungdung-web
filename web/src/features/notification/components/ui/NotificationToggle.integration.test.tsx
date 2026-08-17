import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastHost } from "@/shared/components";
import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";
import { toastStore } from "@/shared/store";

import NotificationToggle from "./NotificationToggle";
import {
  NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE,
} from "../../constants";
import { notificationPermissionStore } from "../../store/notification-permission.store";

vi.mock("@/features/notification/services/request-permission.service", () => ({
  requestFCMToken: vi.fn(async () => ({
    permission: "granted",
    token: "fcm-token",
  })),
}));

vi.mock("@/features/notification/api/client", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/notification/api/client")>();
  return {
    ...actual,
    registerFCMToken: vi.fn(async () => true),
    invalidateFCMToken: vi.fn(async () => true),
  };
});

describe("NOTI-002 | 알림 설정 - 수신 설정 변경", () => {
  beforeEach(() => {
    localStorage.removeItem("notification-permission");
    toastStore.getState().hide();
    notificationPermissionStore.setState({
      permission: "granted",
      permissionHydrated: true,
      enabled: false,
      togglePending: false,
      deviceToken: null,
    });
  });

  afterEach(() => {
    toastStore.getState().hide();
    cleanup();
  });

  it("하나의 수신 설정을 반대로 변경", async () => {
    // 1. 알림 설정 화면 진입
    // 2. 현재 수신 설정과 토글 UI 확인
    // 3. 하나의 수신 설정을 반대로 변경
    // FCM 권한/토큰은 경계 mock
    const user = userEvent.setup({ delay: null });
    render(
      <ViewStoreProvider initialView="mobile">
        <ToastHost />
        <NotificationToggle />
      </ViewStoreProvider>
    );

    const toggle = screen.getByRole("switch", { name: "알림 설정" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);

    expect(
      await screen.findByText(NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE)
    ).toBeVisible();
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
