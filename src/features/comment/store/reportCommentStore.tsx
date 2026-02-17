import { create } from "zustand";

import { ReportedComment } from '../types';

interface ReportCommentState {
  // 상태
  reportedComment: ReportedComment | null;
  isModalOpen: boolean;
  
  // 액션
  openModalToReport: (comment: ReportedComment) => void;
  closeModal: () => void;
}

export const reportCommentStore = create<ReportCommentState>((set) => ({
  // 초기 상태
  reportedComment: null,
  isModalOpen: false,
  
  // 액션
  openModalToReport: (comment: ReportedComment) => {
    set({
      reportedComment: comment,
      isModalOpen: true,
    });
  },
  
  closeModal: () => {
    set({
      isModalOpen: false,
      reportedComment: null,
    });
  },
}));

// 편의를 위한 훅들
export const useReportComment = () => {
  const openModalToReport = reportCommentStore((state) => state.openModalToReport);
  const closeModal = reportCommentStore((state) => state.closeModal);
  return { openModalToReport, closeModal };
};

export const useReportCommentModal = () => {
  const reportedComment = reportCommentStore((state) => state.reportedComment);
  const isModalOpen = reportCommentStore((state) => state.isModalOpen);
  return { reportedComment, isModalOpen };
};
