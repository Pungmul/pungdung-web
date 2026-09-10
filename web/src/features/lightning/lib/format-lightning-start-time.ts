import dayjs from "dayjs";

export const UNDECIDED_START_TIME_LABEL = "미정";
export const LIGHTNING_CARD_UNDECIDED_TIME_LABEL = "만나서 정하기";

const HOUR_MINUTE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function formatLightningStartTimeLabel(
  startTime: string | null | undefined,
  undecidedLabel = UNDECIDED_START_TIME_LABEL
): string {
  if (!startTime) {
    return undecidedLabel;
  }

  if (HOUR_MINUTE.test(startTime)) {
    return startTime;
  }

  const parsed = dayjs(startTime);
  return parsed.isValid() ? parsed.format("HH:mm") : undecidedLabel;
}
