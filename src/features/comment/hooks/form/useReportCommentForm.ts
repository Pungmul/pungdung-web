"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  reportCommentFormSchema,
  type ReportCommentFormValues,
} from "../../types/schemas/report-comment-form.schema";

export function useReportCommentForm() {
  const form = useForm<ReportCommentFormValues>({
    resolver: zodResolver(reportCommentFormSchema),
  });
  const selectedReportReason = useWatch({
    control: form.control,
    name: "reportReason",
  });

  return {
    ...form,
    selectedReportReason,
  };
}
