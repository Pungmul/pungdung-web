import { describe, expect,it } from "vitest";

import {
  EMAIL_SIGN_UP_STEP_ORDER,
  KAKAO_SIGN_UP_STEP_ORDER,
} from "../constants";

import { getNextStepInOrder, getPreviousStepInOrder } from "./sign-up-flow";

describe("sign-up-flow", () => {
  describe("email sign-up order", () => {
    it("advances along EMAIL_SIGN_UP_STEP_ORDER", () => {
      expect(getNextStepInOrder(EMAIL_SIGN_UP_STEP_ORDER, "약관동의")).toBe(
        "계정정보입력"
      );
      expect(
        getNextStepInOrder(EMAIL_SIGN_UP_STEP_ORDER, "완료")
      ).toBeUndefined();
    });

    it("goes back along EMAIL_SIGN_UP_STEP_ORDER", () => {
      expect(
        getPreviousStepInOrder(EMAIL_SIGN_UP_STEP_ORDER, "개인정보입력")
      ).toBe("계정정보입력");
      expect(
        getPreviousStepInOrder(EMAIL_SIGN_UP_STEP_ORDER, "약관동의")
      ).toBeUndefined();
    });
  });

  describe("kakao sign-up order", () => {
    it("advances along KAKAO_SIGN_UP_STEP_ORDER", () => {
      expect(getNextStepInOrder(KAKAO_SIGN_UP_STEP_ORDER, "약관동의")).toBe(
        "개인정보입력"
      );
      expect(
        getNextStepInOrder(KAKAO_SIGN_UP_STEP_ORDER, "완료")
      ).toBeUndefined();
    });

    it("goes back along KAKAO_SIGN_UP_STEP_ORDER", () => {
      expect(getPreviousStepInOrder(KAKAO_SIGN_UP_STEP_ORDER, "완료")).toBe(
        "개인정보입력"
      );
    });
  });
});
