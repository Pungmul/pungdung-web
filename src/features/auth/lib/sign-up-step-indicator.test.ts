import { describe, expect, it } from "vitest";

import {
  EMAIL_SIGN_UP_STEP_ORDER,
  KAKAO_SIGN_UP_STEP_ORDER,
} from "../constants";

import { getSignUpStepCircleBgClass } from "./sign-up-step-indicator";

describe("getSignUpStepCircleBgClass", () => {
  it("이메일 순서: 첫 스텝이면 1번만 현재", () => {
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 0, "약관동의")
    ).toBe("bg-red-500");
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 1, "약관동의")
    ).toBe("bg-grey-300");
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 2, "약관동의")
    ).toBe("bg-grey-300");
  });

  it("이메일 순서: 완료면 표시되는 세 원은 모두 완료 색", () => {
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 0, "완료")
    ).toBe("bg-red-300");
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 1, "완료")
    ).toBe("bg-red-300");
    expect(
      getSignUpStepCircleBgClass(EMAIL_SIGN_UP_STEP_ORDER, 2, "완료")
    ).toBe("bg-red-300");
  });

  it("카카오 순서: KAKAO_SIGN_UP_STEP_ORDER와 동일하게 동작", () => {
    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 0, "약관동의")
    ).toBe("bg-red-500");
    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 1, "약관동의")
    ).toBe("bg-grey-300");

    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 0, "개인정보입력")
    ).toBe("bg-red-300");
    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 1, "개인정보입력")
    ).toBe("bg-red-500");

    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 0, "완료")
    ).toBe("bg-red-300");
    expect(
      getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 1, "완료")
    ).toBe("bg-red-300");
  });
});
