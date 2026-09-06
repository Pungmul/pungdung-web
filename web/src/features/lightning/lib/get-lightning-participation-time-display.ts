import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { LIGHTNING_STATUS } from "../constants";

import type { LightningMeeting } from "../types";

export type LightningParticipationBadgeStatus =
  | "모집중"
  | "준비완료"
  | "모집완료"
  | "종료"
  | "취소";

export interface LightningParticipationTimeDisplay {
  statusLabel: LightningParticipationBadgeStatus;
  subText: string;
  detailRemainingText: string;
}

export function getLightningParticipationTimeDisplay(
  meeting: LightningMeeting,
  now: Dayjs = dayjs()
): LightningParticipationTimeDisplay {
  return {
    statusLabel: getParticipationBadgeStatus(meeting),
    subText: getParticipationSubText(meeting, now),
    detailRemainingText: getDetailRemainingText(meeting, now),
  };
}

function getDetailRemainingText(meeting: LightningMeeting, now: Dayjs) {
  const recruitmentEndTime = dayjs(meeting.recruitmentEndTime);

  if (
    !isRecruitingStatus(meeting.status) ||
    now.isAfter(recruitmentEndTime)
  ) {
    return getParticipationSubText(meeting, now);
  }

  const diffSeconds = Math.max(recruitmentEndTime.diff(now, "second"), 0);
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return `${minutes}분 ${seconds}초 뒤 마감`;
}

function getParticipationBadgeStatus(
  meeting: LightningMeeting
): LightningParticipationBadgeStatus {
  switch (meeting.status) {
    case LIGHTNING_STATUS.READY:
      return "준비완료";
    case LIGHTNING_STATUS.SUCCESS:
      return "모집완료";
    case LIGHTNING_STATUS.END:
      return "종료";
    case LIGHTNING_STATUS.CANCELLED:
      return "취소";
    case LIGHTNING_STATUS.OPEN:
      return "모집중";
  }
}

function getParticipationSubText(meeting: LightningMeeting, now: Dayjs) {
  const recruitmentEndTime = dayjs(meeting.recruitmentEndTime);
  const startTime = dayjs(meeting.startTime);
  const endTime = dayjs(meeting.endTime);

  if (now.isAfter(startTime)) {
    const minutesToEnd = endTime.diff(now, "minute");
    return minutesToEnd > 0 ? `${minutesToEnd}분 뒤 종료` : "종료 시간이 지났어요";
  }

  if (
    !isRecruitingStatus(meeting.status) ||
    now.isAfter(recruitmentEndTime)
  ) {
    const minutesToStart = startTime.diff(now, "minute");
    return minutesToStart > 0 ? `${minutesToStart}분 뒤 시작` : "곧 시작해요";
  }

  const minutesToRecruitmentEnd = recruitmentEndTime.diff(now, "minute");
  return minutesToRecruitmentEnd > 0
    ? `${minutesToRecruitmentEnd}분 남음`
    : "곧 모집이 마감돼요";
}

function isRecruitingStatus(status: LightningMeeting["status"]) {
  return status === LIGHTNING_STATUS.OPEN || status === LIGHTNING_STATUS.READY;
}
