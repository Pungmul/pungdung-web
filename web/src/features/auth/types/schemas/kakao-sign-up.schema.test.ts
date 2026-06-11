/**
 * `kakao-sign-up.schema` — 공개 export와 `stepValidationFields`만 검증한다.
 * 카카오 개인정보 필드 규칙은 `sign-up-personal.schema.test.ts`를 본다.
 */
import { describe, expect, it } from "vitest";

import { buildPersonalSchema, stepValidationFields } from "./kakao-sign-up.schema";

describe("kakao-sign-up.schema", () => {
  it("buildPersonalSchema는 clubIds에 맞게 club을 검증한다", () => {
    const schema = buildPersonalSchema([1]);
    expect(
      schema.safeParse({
        name: "홍길동",
        nickname: undefined,
        club: 1,
        clubAge: "21",
        tellNumber: "010-1234-5678",
        inviteCode: "123456",
      }).success
    ).toBe(true);
    expect(
      schema.safeParse({
        name: "홍길동",
        nickname: undefined,
        club: 99,
        clubAge: "21",
        tellNumber: "010-1234-5678",
        inviteCode: "123456",
      }).success
    ).toBe(false);
  });

  it("stepValidationFields.개인정보입력 필드 목록이 고정이다", () => {
    expect(stepValidationFields.개인정보입력).toEqual([
      "name",
      "tellNumber",
      "inviteCode",
    ]);
  });
});
