import { LIGHTNING_STATUS } from "../constants";

import type { LightningMeeting } from "../types";

// 검색 목록에는 모집중(OPEN)과 최소 인원 충족(READY)만 남김
// SUCCESS는 모임 성사, END는 모임 종료, CANCELLED는 성사 실패 취소
export function shouldRetainLightningMeetingInSearchList(
  status: LightningMeeting["status"]
): boolean {
  return status === LIGHTNING_STATUS.OPEN || status === LIGHTNING_STATUS.READY;
}
