import dayjs from "dayjs";

import type { MemberChangeInfoDto } from "@/features/my-page/api/client/dto.schema";

const CHANGE_LOCK_MONTHS = 6;

function isLockedUntilSixMonthsLater(
  changedAt: string | null,
  referenceDate: string
): boolean {
  if (!changedAt) {
    return false;
  }

  const changedDate = dayjs(changedAt);
  const baseDate = dayjs(referenceDate);

  if (!changedDate.isValid() || !baseDate.isValid()) {
    return false;
  }

  return baseDate.isBefore(changedDate.add(CHANGE_LOCK_MONTHS, "month"), "day");
}

export function formatProfileChangeLockedAt(changedAt: string | null): string {
  if (!changedAt) {
    return "";
  }

  const changedDate = dayjs(changedAt);
  if (!changedDate.isValid()) {
    return "";
  }

  return changedDate.format("YYYY.MM.DD");
}

export function resolveProfileChangeLocks(changeInfo: MemberChangeInfoDto) {
  return {
    isClubNameLocked: isLockedUntilSixMonthsLater(
      changeInfo.clubNameChangedAt,
      changeInfo.updatedAt
    ),
    isClubLocked: isLockedUntilSixMonthsLater(
      changeInfo.clubIdChangedAt,
      changeInfo.updatedAt
    ),
  };
}
