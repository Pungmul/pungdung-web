import { CLIENT_API_ERROR_CODE, ClientApiError } from "@/core/api/client";

import { LIGHTNING_BUILD_MESSAGE } from "../constants";

const LOCATION_FETCH_MESSAGES = new Set([
  "위치 정보를 가져올 수 없습니다.",
  "위치 정보를 가져오는데 실패했습니다.",
]);

const GEO_NOT_SUPPORTED_MESSAGE =
  "Geolocation is not supported by this browser.";

const LOCATION_FORM_MESSAGE = "위치 정보가 필요합니다";

/** `navigator.geolocation` 실패 콜백으로 넘어오는 객체 형태 대응 */
function isLikeGeolocationPositionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const { code } = error as { code?: unknown };

  return code === 1 || code === 2 || code === 3;
}

/** `useCreateLightning`(위치 업데이트 → 요청 생성 → 번개 생성)에서 발생한 오류에 대응 메시지 */
export function getLightningCreateErrorMessage(error: unknown): string {
  const generic = LIGHTNING_BUILD_MESSAGE.COMPLETE.GENERIC_ERROR;

  if (error instanceof ClientApiError) {
    switch (error.code) {
      case CLIENT_API_ERROR_CODE.NETWORK_ERROR:
        return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_NETWORK;
      case CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY:
        return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_CLIENT_REQUEST_SHAPE;
      case CLIENT_API_ERROR_CODE.INVALID_RESPONSE:
        return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_INVALID_RESPONSE_ENVELOPE;
      case CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA:
        return LIGHTNING_BUILD_MESSAGE.COMPLETE
          .ERROR_INVALID_RESPONSE_DATA_SHAPE;
      default:
        return error.message.trim() || generic;
    }
  }

  if (isLikeGeolocationPositionError(error)) {
    return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_UNAVAILABLE;
  }

  if (error instanceof Error) {
    if (
      LOCATION_FETCH_MESSAGES.has(error.message) ||
      error.message === GEO_NOT_SUPPORTED_MESSAGE
    ) {
      return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_UNAVAILABLE;
    }
    if (error.message === LOCATION_FORM_MESSAGE) {
      return LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_REQUIRED;
    }
  }

  return generic;
}
