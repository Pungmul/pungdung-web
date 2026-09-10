import dayjs from "dayjs";

import { formatLightningStartTimeLabel } from "./format-lightning-start-time";
import type { LightningCreateFormData } from "../types/schemas";

/**
 * 모집 요약 카드/스텝에 보여줄 문구를 폼 감시 값에서 만든다.
 */
export function buildLightningSummaryDisplay(watched: {
  lightningType: LightningCreateFormData["lightningType"] | undefined;
  address: string | undefined;
  recruitEndTime: string | undefined;
  startTime: string | undefined;
  isStartTimeUndecided: boolean | undefined;
  target: LightningCreateFormData["target"] | undefined;
}): {
  lightningType: string;
  location: string;
  time: string;
  startTime: string;
  target: string;
} {
  const lightningType = watched.lightningType?.slice(0, 2) || "유형";
  const location = watched.address ? watched.address : "내가 정한 위치";
  const time =
    watched.recruitEndTime || dayjs().add(5, "minute").format("HH:mm");
  const startTime = watched.isStartTimeUndecided
    ? formatLightningStartTimeLabel(null)
    : formatLightningStartTimeLabel(watched.startTime);
  const target = watched.target || "전체";

  return { lightningType, location, time, startTime, target };
}
