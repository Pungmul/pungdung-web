import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { LIGHTNING_STATUS } from "../constants";
import type { LightningMeeting } from "../types";

export type LightningParticipationBadgeStatus = "모집중" | "준비완료" | "진행중";

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
    statusLabel: getParticipationBadgeStatus(meeting, now),
    subText: getParticipationSubText(meeting, now),
    detailRemainingText: getDetailRemainingText(meeting, now),
  };
}

function getDetailRemainingText(meeting: LightningMeeting, now: Dayjs) {
  const recruitmentEndTime = dayjs(meeting.recruitmentEndTime);

  if (
    meeting.status !== LIGHTNING_STATUS.OPEN ||
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
  meeting: LightningMeeting,
  now: Dayjs
): LightningParticipationBadgeStatus {
  if (now.isAfter(dayjs(meeting.startTime))) {
    return "진행중";
  }

  if (
    meeting.status !== LIGHTNING_STATUS.OPEN ||
    now.isAfter(dayjs(meeting.recruitmentEndTime))
  ) {
    return "준비완료";
  }

  return "모집중";
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
    meeting.status !== LIGHTNING_STATUS.OPEN ||
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
