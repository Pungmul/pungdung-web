import type { RequestFCMTokenResult } from "./request-permission.service";

type RegisterFCMToken = (
  token: string,
  deviceInfo: string
) => Promise<boolean>;

type InvalidateFCMToken = (token: string) => Promise<boolean>;

export interface EnableNotificationWorkflowParams {
  requestFCMToken: () => Promise<RequestFCMTokenResult>;
  registerFCMToken: RegisterFCMToken;
  deviceInfo: string;
}

export interface EnableNotificationWorkflowResult {
  enabled: boolean;
  permission: NotificationPermission;
  deviceToken: string | null;
}

export async function enableNotificationWorkflow({
  requestFCMToken,
  registerFCMToken,
  deviceInfo,
}: EnableNotificationWorkflowParams): Promise<EnableNotificationWorkflowResult> {
  const { permission, token } = await requestFCMToken();

  if (permission !== "granted") {
    return {
      enabled: false,
      permission,
      deviceToken: null,
    };
  }

  if (!token) {
    return {
      enabled: false,
      permission,
      deviceToken: null,
    };
  }

  const registered = await registerFCMToken(token, deviceInfo);
  if (!registered) {
    // 등록 실패 시 토큰을 보관하면 sync 훅에서 즉시 invalidate가 연쇄될 수 있으므로 제거한다.
    return {
      enabled: false,
      permission,
      deviceToken: null,
    };
  }

  return {
    enabled: true,
    permission,
    deviceToken: token,
  };
}

export interface DisableNotificationWorkflowParams {
  deviceToken: string | null;
  invalidateFCMToken: InvalidateFCMToken;
}

export interface DisableNotificationWorkflowResult {
  enabled: boolean;
  deviceToken: string | null;
}

export async function disableNotificationWorkflow({
  deviceToken,
  invalidateFCMToken,
}: DisableNotificationWorkflowParams): Promise<DisableNotificationWorkflowResult> {
  if (!deviceToken) {
    return {
      enabled: false,
      deviceToken: null,
    };
  }

  const invalidated = await invalidateFCMToken(deviceToken);

  if (!invalidated) {
    // 서버 해제가 실패하면 실제 수신 가능성이 남아 있으므로 enabled 상태를 유지한다.
    return {
      enabled: true,
      deviceToken,
    };
  }

  return {
    enabled: false,
    deviceToken: null,
  };
}
