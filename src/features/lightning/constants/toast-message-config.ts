import { ToastConfig } from "@/shared/types/toast";

/** 번개 생성 성공 토스트 설정 */
export const createLightningSuccessToastConfig = (
  message?: string
): ToastConfig => {
  return {
    message: message ?? "번개 생성에 성공했습니다.",
    type: "success",
  };
};

/** 번개 생성 실패 토스트 설정 */
export const createLightningErrorToastConfig = (error: Error): ToastConfig => {
  return {
    message: `번개 생성에 실패했습니다.\n${error.message}`,
    type: "error",
  };
};
