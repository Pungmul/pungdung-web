import { LIGHTNING_STATUS } from "../constants";

import type { LightningMeeting } from "../types";

const NON_RETAINED_SEARCH_LIST_STATUSES = new Set<
  (typeof LIGHTNING_STATUS)[keyof typeof LIGHTNING_STATUS]
>([
  LIGHTNING_STATUS.CLOSED,
  LIGHTNING_STATUS.CANCELLED,
  LIGHTNING_STATUS.SUCCESS,
]);

/** search 목록 캐시에 유지할 번개 상태인지 판별 */
export function shouldRetainLightningMeetingInSearchList(
  status: LightningMeeting["status"]
): boolean {
  return !NON_RETAINED_SEARCH_LIST_STATUSES.has(status);
}
