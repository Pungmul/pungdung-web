import dayjs, { type Dayjs } from "dayjs";

const DAY_MS = 24 * 60 * 60 * 1000;
const CLOSED_LABEL = "이미 마감된 공연이에요";

export type PromotionApplyLabel =
  | { kind: "closed"; label: string }
  | { kind: "dday"; label: string }
  | { kind: "countdown"; label: string }
  | { kind: "unavailable"; label: string };

function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${hh}:${mm}:${ss} 신청하기`;
}

// CLOSED면 마감
// OPEN이어도 closeAt이 지났으면 마감
// 남은 시간이 24시간 이상이면 달력 기준 D-N
export function resolvePromotionApplyLabel({
  status,
  closeAt,
  now,
}: {
  status: string;
  closeAt: string | null;
  now: Dayjs;
}): PromotionApplyLabel {
  if (status === "CLOSED") {
    return { kind: "closed", label: CLOSED_LABEL };
  }

  const close = closeAt ? dayjs(closeAt) : null;
  if (close?.isValid() && !close.isAfter(now)) {
    return { kind: "closed", label: CLOSED_LABEL };
  }

  if (status !== "OPEN" || !close?.isValid()) {
    return { kind: "unavailable", label: "신청하기" };
  }

  const remainingMs = close.diff(now);
  if (remainingMs >= DAY_MS) {
    const days = close.startOf("day").diff(now.startOf("day"), "day");
    return { kind: "dday", label: `D-${days}, 신청하기` };
  }

  return { kind: "countdown", label: formatCountdown(remainingMs) };
}
