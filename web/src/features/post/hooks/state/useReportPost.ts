"use client";

import { reportPostStore } from "../../store";

/** 신고 모달 열림·대상 게시글·액션을 한 훅에서 구독한다. */
export function useReportPost() {
  const reportedPost = reportPostStore((state) => state.reportedPost);
  const isModalOpen = reportPostStore((state) => state.isModalOpen);
  const openModalToReport = reportPostStore(
    (state) => state.openModalToReport
  );
  const closeModal = reportPostStore((state) => state.closeModal);

  return {
    reportedPost,
    isModalOpen,
    openModalToReport,
    closeModal,
  };
}
