import { ImageObject } from "@/shared/types/image";

import { CommentReportType } from "@/features/comment/constants/comment-report-enum";

export interface Comment {
  commentId: number;
  postId: number;
  parentId: number | null;
  content: string;
  userName: string;
  profile: ImageObject;
  createdAt: string;
  replies: Comment[];
}

export type Reply = Omit<Comment, "replies">;

export interface ReportedComment {
  commentId: number;
  content: string;
  userName: string;
}

export interface ReportCommentBody {
  reportReason: CommentReportType;
}

export interface MyComment {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  deleted: boolean;
  likedNum: number;
  createdAt: string;
  updatedAt: string;
  postTitle: string;
}

export interface MyCommentResponse {
  total: number;
  list: MyComment[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}


