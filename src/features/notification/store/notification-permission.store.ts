// notificationPermissionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PermissionStatus = NotificationPermission;

type PermissionState = {
  permission: PermissionStatus;
  permissionHydrated: boolean;
  enabled: boolean;
  togglePending: boolean;
  deviceToken: string | null;
  setPermission: (p: PermissionStatus) => void;
  setPermissionHydrated: (hydrated: boolean) => void;
  setEnabled: (enabled: boolean) => void;
  setTogglePending: (pending: boolean) => void;
  setDeviceToken: (token: string | null) => void;
};

export const notificationPermissionStore = create<PermissionState>()(
  persist(
    (set) => ({
      permission: "default",
      permissionHydrated: false,
      enabled: false,
      togglePending: false,
      deviceToken: null,
      setPermission: (permission) => set({ permission }),
      setPermissionHydrated: (permissionHydrated) =>
        set({ permissionHydrated }),
      setEnabled: (enabled) => set({ enabled }),
      setTogglePending: (togglePending) => set({ togglePending }),
      setDeviceToken: (deviceToken) => set({ deviceToken }),
    }),
    {
      name: "notification-permission",
      partialize: (state) => ({ enabled: state.enabled }),
    }
  )
);
