import { describe, expect, it } from "vitest";

import { normalizeEnvelopeInput } from "./normalize-envelope-input";

describe("normalizeEnvelopeInput", () => {
  it("responseCode만 있으면 code로 옮긴다", () => {
    expect(
      normalizeEnvelopeInput({
        isSuccess: false,
        responseCode: "MEMBER_004",
        message: "삭제된 계정입니다.",
        response: null,
      })
    ).toEqual({
      isSuccess: false,
      responseCode: "MEMBER_004",
      message: "삭제된 계정입니다.",
      response: null,
      code: "MEMBER_004",
    });
  });

  it("code가 있으면 responseCode를 무시한다", () => {
    expect(
      normalizeEnvelopeInput({
        code: "SUCCESS",
        responseCode: "MEMBER_004",
        message: "ok",
        response: null,
        isSuccess: true,
      })
    ).toEqual({
      code: "SUCCESS",
      responseCode: "MEMBER_004",
      message: "ok",
      response: null,
      isSuccess: true,
    });
  });
});
