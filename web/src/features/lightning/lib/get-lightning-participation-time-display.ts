import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import {
  formatMinutesUntilStart,
  formatRecruitmentRemainingClock,
  formatRecruitmentRemainingMinutes,
  LIGHTNING_PARTICIPATION_TIME_MESSAGE,
  LIGHTNING_STATUS,
  type LightningParticipationBadgeStatus,
} from "../constants";

import type { LightningMeeting } from "../types";

export type { LightningParticipationBadgeStatus };

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

  if (!isRecruitingStatus(meeting.status) || now.isAfter(recruitmentEndTime)) {
    return getParticipationSubText(meeting, now);
  }

  const diffSeconds = Math.max(recruitmentEndTime.diff(now, "second"), 0);
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return formatRecruitmentRemainingClock(minutes, seconds);
}

function getParticipationBadgeStatus(
  meeting: LightningMeeting
): LightningParticipationBadgeStatus {
  switch (meeting.status) {
    case LIGHTNING_STATUS.READY:
      return LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.READY;
    case LIGHTNING_STATUS.SUCCESS:
      return LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.RECRUITED;
    case LIGHTNING_STATUS.END:
      return LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.ENDED;
    case LIGHTNING_STATUS.CANCELLED:
      return LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.CANCELLED;
    case LIGHTNING_STATUS.OPEN:
      return LIGHTNING_PARTICIPATION_TIME_MESSAGE.BADGE.RECRUITING;
  }
}

function getParticipationSubText(meeting: LightningMeeting, now: Dayjs) {
  const recruitmentEndTime = dayjs(meeting.recruitmentEndTime);
  const isRecruiting =
    isRecruitingStatus(meeting.status) && !now.isAfter(recruitmentEndTime);

  if (isRecruiting) {
    const minutesToRecruitmentEnd = recruitmentEndTime.diff(now, "minute");
    return minutesToRecruitmentEnd > 0
      ? formatRecruitmentRemainingMinutes(minutesToRecruitmentEnd)
      : LIGHTNING_PARTICIPATION_TIME_MESSAGE.RECRUITMENT_CLOSING_SOON;
  }

  if (!meeting.startTime) {
    return LIGHTNING_PARTICIPATION_TIME_MESSAGE.COORDINATE_START_TIME_IN_CHAT;
  }

  const startTime = dayjs(meeting.startTime);
  if (now.isAfter(startTime)) {
    return LIGHTNING_PARTICIPATION_TIME_MESSAGE.IN_PROGRESS;
  }

  const minutesToStart = startTime.diff(now, "minute");
  return minutesToStart > 0
    ? formatMinutesUntilStart(minutesToStart)
    : LIGHTNING_PARTICIPATION_TIME_MESSAGE.STARTING_SOON;
}

function isRecruitingStatus(status: LightningMeeting["status"]) {
  return status === LIGHTNING_STATUS.OPEN || status === LIGHTNING_STATUS.READY;
}
