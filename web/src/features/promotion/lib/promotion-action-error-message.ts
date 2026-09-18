import { ClientApiError } from "@/core/api/client";

import {
  PROMOTION_ACTION_CODE_MESSAGE,
  PROMOTION_PUBLISH_CONDITION_MESSAGE,
  PROMOTION_VERSION_CONFLICT_MESSAGE,
  UNKNOWN_PROMOTION_ACTION_MESSAGE,
} from "../constants/promotion-action-error-copy";

export type PromotionActionErrorPhase = "save" | "publish";

export type PromotionActionErrorCopy = {
  message: string;
  shouldReloadDraft: boolean;
};

const unknownCopy = (): PromotionActionErrorCopy => ({
  message: UNKNOWN_PROMOTION_ACTION_MESSAGE,
  shouldReloadDraft: false,
});

// payload는 envelope JSON 문자열
// POST_023의 response만 발행 조건 코드
function readPublishCondition(error: ClientApiError): string | null {
  if (typeof error.payload !== "string") return null;
  try {
    const envelope = JSON.parse(error.payload) as { response?: unknown };
    return typeof envelope.response === "string" ? envelope.response : null;
  } catch {
    return null;
  }
}

function resolvePublishCondition(error: ClientApiError): string {
  const condition = readPublishCondition(error);
  if (condition && condition in PROMOTION_PUBLISH_CONDITION_MESSAGE) {
    return PROMOTION_PUBLISH_CONDITION_MESSAGE[
      condition as keyof typeof PROMOTION_PUBLISH_CONDITION_MESSAGE
    ];
  }
  return UNKNOWN_PROMOTION_ACTION_MESSAGE;
}

export function resolvePromotionActionError(
  error: unknown,
  phase: PromotionActionErrorPhase
): PromotionActionErrorCopy {
  if (!(error instanceof ClientApiError)) return unknownCopy();

  if (error.code === "POST_010") {
    return {
      message: PROMOTION_VERSION_CONFLICT_MESSAGE[phase],
      shouldReloadDraft: true,
    };
  }

  if (error.code === "POST_023") {
    return {
      message: resolvePublishCondition(error),
      shouldReloadDraft: false,
    };
  }

  if (error.code in PROMOTION_ACTION_CODE_MESSAGE) {
    return {
      message:
        PROMOTION_ACTION_CODE_MESSAGE[
          error.code as keyof typeof PROMOTION_ACTION_CODE_MESSAGE
        ],
      shouldReloadDraft: false,
    };
  }

  return unknownCopy();
}
