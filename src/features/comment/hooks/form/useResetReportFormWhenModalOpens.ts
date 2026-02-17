"use client";

import { useEffect } from "react";

import type { UseFormReset } from "react-hook-form";

import type { ReportCommentFormValues } from "../../types/schemas/report-comment-form.schema";

interface UseResetReportFormWhenModalOpensParams {
  isModalOpen: boolean;
  reset: UseFormReset<ReportCommentFormValues>;
}

export function useResetReportFormWhenModalOpens({
  isModalOpen,
  reset,
}: UseResetReportFormWhenModalOpensParams) {
  useEffect(() => {
    reset();
  }, [isModalOpen, reset]);
}
