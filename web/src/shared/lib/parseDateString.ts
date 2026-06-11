function toKST(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 9 * 60 * 60 * 1000);
}

/** `PostSummary.timeSincePosted`와 동일한 형태 — 경과 **분**(내림)과 한글 상대 시각. */
export type TimeSincePosted = {
  timeSincePosted: number;
  timeSincePostedText: string;
};

function formatSeoulShortYmd(anchor: Date, nowRef: Date): string {
  const parts = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(d)
      .split("-");

  const [y, mo, da] = parts(anchor);
  const [ny] = parts(nowRef);
  return ny === y ? `${mo}.${da}` : `${y}.${mo}.${da}`;
}

/**
 * `createdAt`(ISO 등 파싱 가능한 문자열 또는 Date) 기준 경과 시간.
 * - `timeSincePosted`: 경과 **전체 분**(내림). 시간·일 문구와 숫자가 어긋날 수 있음(예: 172분 → `"2시간 전"`).
 * - `now`를 넘기면 테스트·스냅샷 고정용.
 */
export function getTimeSincePosted(
  createdAt: string | Date,
  now: Date = new Date()
): TimeSincePosted {
  const input =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  if (Number.isNaN(input.getTime())) {
    return { timeSincePosted: 0, timeSincePostedText: "" };
  }

  const diffMs = now.getTime() - input.getTime();
  const totalMinutes = Math.floor(diffMs / (60 * 1000));

  if (totalMinutes < 1) {
    return { timeSincePosted: Math.max(0, totalMinutes), timeSincePostedText: "방금" };
  }

  if (totalMinutes < 60) {
    return {
      timeSincePosted: totalMinutes,
      timeSincePostedText: `${totalMinutes}분 전`,
    };
  }

  if (totalMinutes < 60 * 24) {
    return {
      timeSincePosted: totalMinutes,
      timeSincePostedText: `${Math.floor(totalMinutes / 60)}시간 전`,
    };
  }

  const days = Math.floor(totalMinutes / (60 * 24));
  if (days < 7) {
    return {
      timeSincePosted: totalMinutes,
      timeSincePostedText: `${days}일 전`,
    };
  }

  return {
    timeSincePosted: totalMinutes,
    timeSincePostedText: formatSeoulShortYmd(input, now),
  };
}

export function formatRelativeDate(inputDate: Date): string {
  const now = toKST(new Date());
  const input = toKST(inputDate);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const inputStart = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate()
  );

  const diffMs = now.getTime() - input.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  const isToday = inputStart.getTime() === todayStart.getTime();

  if (isToday) {
    if (diffMin < 1) {
      return "방금 전";
    }

    if (diffHour < 1) {
      return `${diffMin}분 전`;
    }

    const hour = input.getHours();
    const minute = input.getMinutes().toString().padStart(2, "0");
    const isAM = hour < 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${isAM ? "오전" : "오후"} ${formattedHour}:${minute}`;
  }

  const diffDateCount = Math.floor(
    (todayStart.getTime() - inputStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDateCount < 7) {
    return `${diffDateCount}일 전`;
  }

  const nowYear = now.getFullYear();
  const inputYear = input.getFullYear();
  const month = (input.getMonth() + 1).toString().padStart(2, "0");
  const date = input.getDate().toString().padStart(2, "0");

  if (nowYear !== inputYear) {
    return `${inputYear}년 ${month}월 ${date}일`;
  }

  return `${month}월 ${date}일`;
} 