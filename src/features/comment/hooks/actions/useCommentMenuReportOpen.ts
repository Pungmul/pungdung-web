"use client";

import { useCallback } from "react";

import { useReportComment } from "../../store";
import type { ReportedComment } from "../../types";

export function useCommentMenuReportOpen(
  comment: ReportedComment,
  closeMenu: () => void
) {
  const { openModalToReport } = useReportComment();

  return useCallback(() => {
    openModalToReport(comment);
    closeMenu();
  }, [closeMenu, comment, openModalToReport]);
}
