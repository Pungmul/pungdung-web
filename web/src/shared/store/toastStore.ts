import { create } from "zustand";

import { ToastConfig, ToastItem } from "../types/toast";

const DEFAULT_TOAST_DURATION = 5000;
const MAX_TOAST_COUNT = 5;

const timerMap = new Map<string, ReturnType<typeof setTimeout>>();

let toastIdSeed = 0;

const createToastId = () => {
  toastIdSeed += 1;
  return `${Date.now()}-${toastIdSeed}`;
};

const clearToastTimer = (id: string) => {
  const timer = timerMap.get(id);
  if (!timer) return;

  clearTimeout(timer);
  timerMap.delete(id);
};

const removeToast = (id: string) => {
  clearToastTimer(id);
  toastStore.setState((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  }));
};

interface ToastState {
  toasts: ToastItem[];
  hide: (id?: string) => void;
}

export const toastStore = create<ToastState>(() => ({
  toasts: [],
  hide: (id) => {
    if (id) {
      removeToast(id);
      return;
    }

    timerMap.forEach((timer) => clearTimeout(timer));
    timerMap.clear();
    toastStore.setState({ toasts: [] });
  },
}));

export const Toast = {
  show: ({
    message,
    type = "success",
    duration = DEFAULT_TOAST_DURATION,
  }: ToastConfig) => {
    const toast: ToastItem = {
      id: createToastId(),
      message,
      type,
      duration,
    };

    toastStore.setState((state) => {
      const nextToasts = [...state.toasts, toast].slice(-MAX_TOAST_COUNT);
      const visibleToastIds = new Set(nextToasts.map(({ id }) => id));

      state.toasts.forEach(({ id }) => {
        if (!visibleToastIds.has(id)) {
          clearToastTimer(id);
        }
      });

      return { toasts: nextToasts };
    });

    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, duration);
      timerMap.set(toast.id, timer);
    }
  },
  hide: (id?: string) => {
    toastStore.getState().hide(id);
  },
};
