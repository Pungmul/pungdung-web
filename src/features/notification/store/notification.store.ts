import { create } from "zustand";

import type { NotificationData } from "../types";

interface NotificationState {
  notifications: NotificationData[];
  addNotification: (n: NotificationData) => void;
  clearNotifications: () => void;
}

export const notificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({ notifications: [n, ...state.notifications] })),
  clearNotifications: () => set({ notifications: [] }),
}));
