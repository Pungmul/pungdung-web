import { create } from "zustand";

import type { NotificationData } from "../types";

interface NotificationState {
  notifications: NotificationData[];
  /** Replaces any visible in-app banner with the latest push (single-slot). */
  addNotification: (notification: NotificationData) => void;
  dismissNotification: () => void;
}

export const notificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => set({ notifications: [notification] }),
  dismissNotification: () => set({ notifications: [] }),
}));

export const dismissNotification = () => {
  notificationStore.getState().dismissNotification();
};
