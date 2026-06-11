import { CSSProperties } from "react";

import { create } from "zustand";

interface AlertData {
  title: string;
  type: "alert" | "confirm";
  message: string;
  subMessage: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: CSSProperties["color"];
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertStore {
  isOpen: boolean;
  data: AlertData;
  alert: (data: {
    title: string;
    message: string;
    subMessage?: string;
    onConfirm?: () => void;
    confirmText?: string;
  }) => void;
  confirm: (data: {
    title: string;
    message: string;
    subMessage?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: CSSProperties["color"];
  }) => void;
  close: () => void;
}

export const alertStore = create<AlertStore>((set) => ({
  isOpen: false,
  data: {
    title: "알림",
    type: "alert",
    message: "알림 메시지",
    subMessage: "",
    confirmText: "확인",
    cancelText: "취소",
  },
  alert: ({ title, message, subMessage, onConfirm, confirmText = "확인" }) => {
    const handleConfirm = () => {
      onConfirm?.();
      set({ isOpen: false });
    };

    set({
      isOpen: true,
      data: {
        title: title,
        type: "alert",
        message: message,
        confirmText: confirmText,
        subMessage: subMessage??"",
        onConfirm: handleConfirm,
      },
    });
  },
  confirm: ({
    title,
    message,
    subMessage,
    onConfirm,
    onCancel,
    confirmText = "확인",
    cancelText = "취소",
    confirmColor = "var(--color-grey-800)",
  }) => {
    const handleConfirm = () => {
      onConfirm?.();
      set({ isOpen: false });
    };

    const handleCancel = () => {
      onCancel?.();
      set({ isOpen: false });
    };

    set({
      isOpen: true,
      data: {
        title: title,
        type: "confirm",
        message: message,
        confirmText: confirmText,
        cancelText: cancelText, 
        subMessage: subMessage??"",
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        confirmColor: confirmColor,
      },
    });
  },
  close: () => {
    set({ isOpen: false });
  },
}));


export const Alert = {
  alert: (data: {
    title: string;
    message: string;
    subMessage?: string;
    onConfirm?: () => void;
    confirmText?: string;
  }) => {
    alertStore.getState().alert(data);
  },
  confirm: (data: {
    title: string;
    message: string;
    subMessage?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: CSSProperties["color"];
  }) => {
    alertStore.getState().confirm(data);
  },
};
