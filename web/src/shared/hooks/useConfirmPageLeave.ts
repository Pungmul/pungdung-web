"use client";

import { useCallback, useRef } from "react";

import { useNavigationGuard } from "next-navigation-guard";

import { Alert } from "@/shared/store";

export type ConfirmPageLeaveAlert = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

// 화면 안 이동은 Alert
// 탭 닫기, 새로고침은 브라우저 beforeunload
export function useConfirmPageLeave({
  enabled,
  alert,
}: {
  enabled: boolean;
  alert: ConfirmPageLeaveAlert;
}) {
  const enabledRef = useRef(enabled);
  const allowLeaveRef = useRef(false);
  const alertRef = useRef(alert);

  enabledRef.current = enabled;
  alertRef.current = alert;

  const allowLeave = useCallback(() => {
    allowLeaveRef.current = true;
  }, []);

  const isEnabled = useCallback(
    () => enabledRef.current && !allowLeaveRef.current,
    []
  );

  const confirm = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        const copy = alertRef.current;
        Alert.confirm({
          title: copy.title,
          message: copy.message,
          confirmText: copy.confirmText ?? "나가기",
          cancelText: copy.cancelText ?? "머무르기",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      }),
    []
  );

  useNavigationGuard({
    enabled: isEnabled,
    confirm,
  });

  return { allowLeave };
}
