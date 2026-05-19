import { mergeReadTargetMessageId } from "./merge-read-target-message-id.service";
import { toNumericMessageId } from "../../lib/message/parse-message-id";
import { resolveLatestNumericMessageIdFromList } from "../message/resolve-latest-numeric-message-id-from-list.service";

type EnsureReadSignTargetMessageIdParams = {
  currentTargetMessageId: number | null;
  upToMessageId?: number | string | null | undefined;
  timelineMessages?: readonly { id: number | string }[] | undefined;
};

/**
 * readSign publish 직전에 사용할 target message id를 확정한다.
 * upToMessageId → 기존 target → 타임라인 최신 id 순으로 보완한다.
 */
export function ensureReadSignTargetMessageId(
  params: EnsureReadSignTargetMessageIdParams
): number | null {
  const upToMessageId = toNumericMessageId(params.upToMessageId);
  if (upToMessageId !== null) {
    return mergeReadTargetMessageId(params.currentTargetMessageId, upToMessageId);
  }

  if (params.currentTargetMessageId !== null) {
    return params.currentTargetMessageId;
  }

  if (params.timelineMessages === undefined || params.timelineMessages.length === 0) {
    return null;
  }

  return resolveLatestNumericMessageIdFromList(params.timelineMessages);
}
