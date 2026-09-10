import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { RefinementCtx } from "zod";

import { LIGHTNING_CREATE_FORM_FIELD } from "../constants";

export function addLightningMeetingTimeIssues(
  data: {
    recruitEndTime: string;
    startTime: string;
    isStartTimeUndecided: boolean;
  },
  ctx: RefinementCtx,
  now: Dayjs = dayjs()
) {
  const today = now.format("YYYY-MM-DD");

  if (data.recruitEndTime) {
    const recruitEnd = dayjs(`${today}T${data.recruitEndTime}`);
    if (recruitEnd.isBefore(now)) {
      ctx.addIssue({
        code: "custom",
        path: [LIGHTNING_CREATE_FORM_FIELD.RECRUIT_END_TIME],
        message: "모집 마감 시간이 이미 지났습니다",
      });
    }
  }

  if (data.isStartTimeUndecided) {
    return;
  }

  if (!data.startTime) {
    ctx.addIssue({
      code: "custom",
      path: [LIGHTNING_CREATE_FORM_FIELD.START_TIME],
      message: "시작 시간을 선택해주세요",
    });
    return;
  }

  const start = dayjs(`${today}T${data.startTime}`);
  if (start.isBefore(now)) {
    ctx.addIssue({
      code: "custom",
      path: [LIGHTNING_CREATE_FORM_FIELD.START_TIME],
      message: "시작 시간이 이미 지났습니다",
    });
  }

  if (data.recruitEndTime && dayjs(`${today}T${data.recruitEndTime}`).isAfter(start)) {
    ctx.addIssue({
      code: "custom",
      path: [LIGHTNING_CREATE_FORM_FIELD.RECRUIT_END_TIME],
      message: "모집 마감 시간은 시작 시간보다 늦을 수 없습니다",
    });
  }
}
