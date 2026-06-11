import { create } from "zustand";

export interface ReportedPost {
  postId: number;
  title: string;
  author: string;
}

interface ReportPostState {
  reportedPost: ReportedPost | null;
  isModalOpen: boolean;
  openModalToReport: (post: ReportedPost) => void;
  closeModal: () => void;
}

export const reportPostStore = create<ReportPostState>((set) => ({
  reportedPost: null,
  isModalOpen: false,

  openModalToReport: (post) => {
    set({
      reportedPost: post,
      isModalOpen: true,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      reportedPost: null,
    });
  },
}));
