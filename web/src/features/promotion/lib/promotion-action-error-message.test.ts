import { describe, expect, it } from "vitest";

import { CLIENT_API_ERROR_CODE, ClientApiError } from "@/core/api/client";

import { formatPromotionActionError } from "./promotion-action-error-message";

const apiError = (code: string, message: string) =>
  new ClientApiError({ status: 400, code, message });

describe("formatPromotionActionError", () => {
  it("서버 사유가 있으면 제목 뒤에 붙인다", () => {
    expect(
      formatPromotionActionError("게시 실패", apiError("FORM_INVALID", "질문이 없습니다."))
    ).toBe("게시 실패 질문이 없습니다.");
  });

  it.each([
    ["응답 스키마 오류", apiError(CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA, "zod")],
    ["일반 Error", new Error("boom")],
    ["빈 메시지", apiError("FORM_INVALID", "")],
  ])("%s면 제목만 보여준다", (_label, error) => {
    expect(formatPromotionActionError("게시 실패", error)).toBe("게시 실패");
  });
});
