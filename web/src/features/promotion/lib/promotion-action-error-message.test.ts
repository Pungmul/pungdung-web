import { describe, expect, it } from "vitest";

import { ClientApiError } from "@/core/api/client";

import {
  PROMOTION_ACTION_CODE_MESSAGE,
  PROMOTION_PUBLISH_CONDITION_MESSAGE,
  PROMOTION_VERSION_CONFLICT_MESSAGE,
  UNKNOWN_PROMOTION_ACTION_MESSAGE,
} from "../constants/promotion-action-error-copy";
import { resolvePromotionActionError } from "./promotion-action-error-message";

const apiError = (code: string, response: unknown = null) =>
  new ClientApiError({
    status: 400,
    code,
    message: "서버 원문",
    payload: JSON.stringify({
      code,
      message: "서버 원문",
      response,
      isSuccess: false,
    }),
  });

describe("resolvePromotionActionError", () => {
  it.each(Object.entries(PROMOTION_ACTION_CODE_MESSAGE))(
    "%s는 정해진 문구를 쓴다",
    (code, message) => {
      expect(resolvePromotionActionError(apiError(code), "publish")).toEqual({
        message,
        shouldReloadDraft: false,
      });
    }
  );

  it("저장 버전 충돌과 게시 버전 충돌은 동사만 다르다", () => {
    expect(resolvePromotionActionError(apiError("POST_010"), "save")).toEqual({
      message: PROMOTION_VERSION_CONFLICT_MESSAGE.save,
      shouldReloadDraft: true,
    });
    expect(resolvePromotionActionError(apiError("POST_010"), "publish")).toEqual({
      message: PROMOTION_VERSION_CONFLICT_MESSAGE.publish,
      shouldReloadDraft: true,
    });
  });

  it.each(Object.entries(PROMOTION_PUBLISH_CONDITION_MESSAGE))(
    "POST_023 %s",
    (response, message) => {
      expect(
        resolvePromotionActionError(apiError("POST_023", response), "publish")
      ).toEqual({ message, shouldReloadDraft: false });
    }
  );

  it.each([
    ["표 밖 response", apiError("POST_023", "SHOULD_INCLUDE_QUESTION")],
    ["response 없음", apiError("POST_023", null)],
    ["알 수 없는 코드", apiError("FORM_INVALID")],
    ["네트워크", new Error("boom")],
  ])("%s면 새로고침 안내를 보여준다", (_label, error) => {
    expect(resolvePromotionActionError(error, "publish")).toEqual({
      message: UNKNOWN_PROMOTION_ACTION_MESSAGE,
      shouldReloadDraft: false,
    });
  });
});
