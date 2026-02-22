import dayjs from "dayjs";

/**
 * 공연 날짜 포맷 (YYYY.MM.DD(ddd))
 * startAt 없을 때 "미정" 반환
 */
export function formatPromotionDate(startAt: string | null | undefined): string {
  if (!startAt) return "미정";
  return dayjs(new Date(startAt)).format("YYYY.MM.DD(ddd)");
}

/**
 * 공연 시간 포맷 (이른/늦은 h시 mm분)
 * startAt 없을 때 "미정" 반환
 */
export function formatPromotionTime(startAt: string | null | undefined): string {
  if (!startAt) return "미정";
  const date = dayjs(new Date(startAt));
  const hour = date.hour();
  const timePrefix = hour < 12 ? "이른" : "늦은";
  const time12 = date.format("h시 mm분");
  return `${timePrefix} ${time12}`;
}
