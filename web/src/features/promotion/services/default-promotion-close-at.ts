import dayjs from "dayjs";

const CLOSE_AT_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const DEFAULT_CLOSE_DAYS_BEFORE = 7;

export function promotionCloseDateBounds(
  performanceDate: string,
  today: string
): { min: string; max: string } | null {
  const min = dayjs(today).add(1, "day").format("YYYY-MM-DD");
  const max = dayjs(performanceDate).subtract(1, "day").format("YYYY-MM-DD");
  if (max < min) return null;
  return { min, max };
}

function nearestDate(target: string, min: string, max: string): string {
  if (target < min) return min;
  if (target > max) return max;
  return target;
}

// 허용 범위는 내일부터 공연 전날
// 범위 밖 날짜는 가장 가까운 허용일
// 가능한 날이 없으면 빈 문자열
export function resolvePromotionCloseAt({
  performanceDate,
  closeAt,
  today = dayjs().format("YYYY-MM-DD"),
}: {
  performanceDate: string;
  closeAt: string;
  today?: string;
}): string {
  if (!performanceDate) return "";

  const bounds = promotionCloseDateBounds(performanceDate, today);
  if (!bounds) return "";

  const parsedCloseAt = closeAt ? dayjs(closeAt) : null;
  if (parsedCloseAt?.isValid()) {
    const date = nearestDate(
      parsedCloseAt.format("YYYY-MM-DD"),
      bounds.min,
      bounds.max
    );
    return `${date}T${parsedCloseAt.format("HH:mm:ss")}`;
  }

  const preferredDate = dayjs(performanceDate)
    .subtract(DEFAULT_CLOSE_DAYS_BEFORE, "day")
    .format("YYYY-MM-DD");
  return `${nearestDate(preferredDate, bounds.min, bounds.max)}T00:00:00`;
}

export { CLOSE_AT_FORMAT };
