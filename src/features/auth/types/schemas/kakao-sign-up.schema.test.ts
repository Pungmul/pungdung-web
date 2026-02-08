/**
 * `kakao-sign-up.schema` 오케스트레이션 — 공개 export와 `fullSignUpSchema` 구성만 검증한다.
 * 카카오 개인정보 필드 규칙은 `sign-up-personal.schema.test.ts`를 본다.
 */
import { describe, expect, it } from "vitest";

import {
  fullSignUpSchema,
  personalSchema,
  stepValidationFields,
} from "./kakao-sign-up.schema";

describe("kakao-sign-up.schema", () => {
  it("fullSignUpSchema는 personalSchema와 동일 참조다", () => {
    expect(fullSignUpSchema).toBe(personalSchema);
  });

  it("stepValidationFields.개인정보입력 필드 목록이 고정이다", () => {
    expect(stepValidationFields.개인정보입력).toEqual([
      "name",
      "tellNumber",
      "inviteCode",
    ]);
  });
});
