"use client";

import { alertStore } from "@/shared/store";

import { AlertDialog } from "./AlertDialog";

export function AlertModal() {
  const isOpen = alertStore((state) => state.isOpen);
  const data = alertStore((state) => state.data);
  const closeAlert = alertStore().close;

  return (
    <AlertDialog
      isOpen={isOpen}
      title={data.title}
      message={data.message}
      subMessage={data.subMessage}
      type={data.type}
      confirmText={data.confirmText}
      cancelText={data.cancelText}
      confirmColor={data.confirmColor}
      onConfirm={data.onConfirm}
      onCancel={data.onCancel}
      onClose={closeAlert}
    />
  );
}
