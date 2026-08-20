import { describe, expect, it } from "vitest";

import { ClientApiError } from "@/core/api/client";

import { AUTH_DOMAIN_MESSAGE } from "../constants";
import { getSignUpCompleteErrorMessage, isDeletedAccountSignUpError } from "./get-sign-up-complete-error-message";

describe("getSignUpCompleteErrorMessage", () => {
  it("MEMBER_004이면 재가입 불가 안내를 반환한다", () => {
    const error = new ClientApiError({
      status: 403,
      code: "MEMBER_004",
      message: "삭제된 계정입니다.",
    });

    expect(getSignUpCompleteErrorMessage(error)).toBe(
      AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.DELETED_ACCOUNT
    );
    expect(isDeletedAccountSignUpError(error)).toBe(true);
  });

  it("그 외 Error는 message를 그대로 반환한다", () => {
    expect(getSignUpCompleteErrorMessage(new Error("네트워크 오류"))).toBe(
      "네트워크 오류"
    );
  });
});
