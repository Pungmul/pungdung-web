export const LIGHTNING_PARTICIPATION_TIME_MESSAGE = {
  BADGE: {
    RECRUITING: "모집중",
    READY: "준비완료",
    RECRUITED: "모집완료",
    ENDED: "종료",
    CANCELLED: "취소",
  },
  RECRUITMENT_CLOSING_SOON: "곧 모집이 마감돼요",
  COORDINATE_START_TIME_IN_CHAT: "채팅방에서 모임 시간을 조율해요",
  IN_PROGRESS: "진행 중",
  STARTING_SOON: "곧 시작해요",
} as const;

export type LightningParticipationBadgeStatus =
  (typeof LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE)[keyof typeof LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE];

export function formatRecruitmentRemainingMinutes(minutes: number) {
  return `${minutes}분 남음`;
}

export function formatRecruitmentRemainingClock(
  minutes: number,
  seconds: number
) {
  return `${minutes}분 ${seconds}초 뒤 마감`;
}

export function formatMinutesUntilStart(minutes: number) {
  return `${minutes}분 뒤 시작`;
}
