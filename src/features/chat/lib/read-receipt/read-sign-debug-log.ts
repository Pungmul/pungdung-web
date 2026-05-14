const LOG_PREFIX = "[chat:readSign]";

function isTruthyEnvFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

/**
 * - local dev (`npm run dev`): 기본 ON
 * - production build: 기본 OFF, `NEXT_PUBLIC_CHAT_READ_SIGN_DEBUG=1` 로 빌드 시 ON
 *
 * `NEXT_PUBLIC_*` 는 빌드 타임에 박히므로 prod에서는 배포 파이프라인 env 설정 후 재빌드 필요.
 */
export function isReadSignDebugEnabled(): boolean {
  if (isTruthyEnvFlag(process.env.NEXT_PUBLIC_CHAT_READ_SIGN_DEBUG)) {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

export function logReadSignDebug(
  event: string,
  payload?: Record<string, unknown>
): void {
  if (!isReadSignDebugEnabled()) {
    return;
  }

  // console.debug 는 DevTools 기본 필터에서 숨겨지는 경우가 많아 log 사용
  if (payload === undefined) {
    console.log(LOG_PREFIX, event);
    return;
  }

  console.log(LOG_PREFIX, event, payload);
}
