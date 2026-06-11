/**
 * 간격 값 포맷팅
 * @param value 값 (HH:mm:ss)
 * @param minuteInterval 분 간격 (1, 5, 15, 30)
 * @param secondInterval 초 간격 (1, 5, 15, 30)
 * @returns 포맷팅된 값 (HH:mm:ss)
 */
export const formatIntervalValue = (
  value: string,
  minuteInterval: number,
  secondInterval?: number
) => {
  const [hour, minute, second] = value.split(":");
  const formattedMinute =
    Math.ceil(parseInt(minute || "0") / minuteInterval) * minuteInterval;
  const formattedSecond = secondInterval
    ? Math.ceil(parseInt(second || "0") / secondInterval) * secondInterval
    : undefined;

  if (!!secondInterval) {
    return `${hour}:${formattedMinute
      .toString()
      .padStart(2, "0")}:${formattedSecond?.toString().padStart(2, "0")}`;
  }

  return `${hour}:${formattedMinute.toString().padStart(2, "0")}`;
};
