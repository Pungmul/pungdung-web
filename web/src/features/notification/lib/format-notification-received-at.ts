const SEOUL_TIME_ZONE = "Asia/Seoul";

function seoulYmd(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const read = (type: "year" | "month" | "day") =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: read("year"), month: read("month"), day: read("day") };
}

export function formatNotificationReceivedAt(
  receivedAt: Date,
  now: Date = new Date()
): string {
  if (Number.isNaN(receivedAt.getTime()) || receivedAt.getTime() === 0) {
    return "";
  }

  const received = seoulYmd(receivedAt);
  const current = seoulYmd(now);
  const isSameDay =
    received.year === current.year &&
    received.month === current.month &&
    received.day === current.day;

  if (isSameDay) {
    const diffMin = Math.floor((now.getTime() - receivedAt.getTime()) / 60_000);
    if (diffMin < 1) return "방금";
    if (diffMin < 60) return `${diffMin}분전`;
    return `${Math.floor(diffMin / 60)}시간전`;
  }

  if (received.year !== current.year) {
    return `${received.year}년 ${received.month}월 ${received.day}일`;
  }

  return `${received.month}월 ${received.day}일`;
}
