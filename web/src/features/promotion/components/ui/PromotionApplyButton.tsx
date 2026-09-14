"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { Button } from "@/shared";

import { resolvePromotionApplyLabel } from "../../lib/promotion-apply-label";

export function PromotionApplyButton({
  status,
  closeAt,
  hasApplied,
  pending,
  onApply,
}: {
  status: string;
  closeAt: string | null;
  hasApplied: boolean;
  pending: boolean;
  onApply: () => void;
}) {
  const [now, setNow] = useState(() => dayjs());
  const applyLabel = resolvePromotionApplyLabel({ status, closeAt, now });
  const canApply = applyLabel.kind === "dday" || applyLabel.kind === "countdown";

  useEffect(() => {
    if (hasApplied || !canApply) return;
    const timerId = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timerId);
  }, [canApply, hasApplied]);

  if (hasApplied) {
    return (
      <Button
        type="button"
        className="bg-blue-600 text-white disabled:!bg-grey-300 disabled:!text-grey-500 disabled:cursor-not-allowed"
        disabled
      >
        이미 신청한 공연
      </Button>
    );
  }

  return (
    <Button
      type="button"
      className="bg-blue-600 text-white disabled:!bg-grey-300 disabled:!text-grey-500 disabled:cursor-not-allowed"
      disabled={!canApply || pending}
      onClick={onApply}
    >
      {applyLabel.label}
    </Button>
  );
}
