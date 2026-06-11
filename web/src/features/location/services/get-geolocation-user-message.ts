/** `GeolocationPositionError.code` (MDN) */
const GEO_PERMISSION_DENIED = 1;
const GEO_POSITION_UNAVAILABLE = 2;
const GEO_TIMEOUT = 3;

function isLikelyGeolocationPositionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = (error as { code?: unknown }).code;
  return (
    typeof code === "number" &&
    Number.isInteger(code) &&
    code >= GEO_PERMISSION_DENIED &&
    code <= GEO_TIMEOUT
  );
}

/**
 * `navigator.geolocation` 실패(`GeolocationPositionError`) 시 사용자에게 보일 문구.
 * 해당 타입이 아니면 `null`.
 */
export function getGeolocationUserMessage(error: unknown): string | null {
  if (!isLikelyGeolocationPositionError(error)) return null;

  const code = (error as { code: number }).code;

  switch (code) {
    case GEO_PERMISSION_DENIED:
      return "위치 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.";
    case GEO_POSITION_UNAVAILABLE:
      return "현재 위치를 확인할 수 없습니다. 기기/OS 위치 설정을 확인해 주세요.";
    case GEO_TIMEOUT:
      return "위치 정보를 요청 시간 안에 받지 못했습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return null;
  }
}
