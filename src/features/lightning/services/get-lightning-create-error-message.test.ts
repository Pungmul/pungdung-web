import { describe, expect, it } from "vitest";

import { CLIENT_API_ERROR_CODE, ClientApiError } from "@/core/api/client";

import { LIGHTNING_BUILD_MESSAGE } from "../constants";
import { getLightningCreateErrorMessage } from "./get-lightning-create-error-message";

describe("getLightningCreateErrorMessage", () => {
  it("ClientApiError NETWORK_ERROR → 네트워크 안내", () => {
    const err = new ClientApiError({
      status: 0,
      code: CLIENT_API_ERROR_CODE.NETWORK_ERROR,
      message: "네트워크 요청에 실패했습니다.",
    });

    expect(getLightningCreateErrorMessage(err)).toBe(
      LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_NETWORK
    );
  });

  it("ClientApiError INVALID_REQUEST_BODY → 요청 형식 안내", () => {
    const err = new ClientApiError({
      status: 0,
      code: CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY,
      message: "요청 바디 형식이 올바르지 않습니다.",
    });

    expect(getLightningCreateErrorMessage(err)).toBe(
      LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_CLIENT_REQUEST_SHAPE
    );
  });

  it("ClientApiError 기타 업스트림 → 서버·클라이언트 메시지 그대로", () => {
    const err = new ClientApiError({
      status: 400,
      code: "SOME_BACKEND_CODE",
      message: "이미 진행 중인 번개가 있어요",
    });

    expect(getLightningCreateErrorMessage(err)).toBe(
      "이미 진행 중인 번개가 있어요"
    );
  });

  it("updateLocation에서 던진 위치 문자열 → 위치 불가 안내", () => {
    expect(
      getLightningCreateErrorMessage(
        new Error("위치 정보를 가져올 수 없습니다.")
      )
    ).toBe(LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_UNAVAILABLE);

    expect(
      getLightningCreateErrorMessage(
        new Error("위치 정보를 가져오는데 실패했습니다.")
      )
    ).toBe(LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_UNAVAILABLE);
  });

  it("buildLightningRequest 위치 누락 → 장소 필요 안내", () => {
    expect(
      getLightningCreateErrorMessage(new Error("위치 정보가 필요합니다"))
    ).toBe(LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_REQUIRED);
  });

  it("GPS 실패 콜백 형태(code 1~3) → 위치 불가 안내", () => {
    expect(getLightningCreateErrorMessage({ code: 1, message: "denied" })).toBe(
      LIGHTNING_BUILD_MESSAGE.COMPLETE.ERROR_LOCATION_UNAVAILABLE
    );
  });
});
