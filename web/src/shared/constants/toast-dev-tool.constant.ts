import type { ToastType } from "@/shared/types/toast";

export const DEV_TOAST_TYPES = [
  "success",
  "error",
  "warning",
  "info",
] as const satisfies readonly ToastType[];

export const DEV_TOAST_LABEL = {
  success: "성공",
  error: "오류",
  warning: "경고",
  info: "안내",
} as const satisfies Record<ToastType, string>;
