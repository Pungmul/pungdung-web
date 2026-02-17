"use client";

import { useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UseFormHandleSubmit } from "react-hook-form";

import { postQueries } from "@/features/post";

import { Toast } from "@/shared/store";

import { commentMutationOptions } from "../../queries";
import { reportCommentStore } from "../../store";
import type { ReportCommentFormValues } from "../form";

interface UseReportCommentActionParams {
  closeModal: () => void;
  handleSubmit: UseFormHandleSubmit<ReportCommentFormValues>;
}

export function useReportCommentAction({
  closeModal,
  handleSubmit,
}: UseReportCommentActionParams) {
  const queryClient = useQueryClient();

  // prop 클로저 대신 스토어에서 직접 읽어 항상 최신 값을 참조한다.
  const reportedCommentRef = useRef(
    reportCommentStore.getState().reportedComment
  );
  reportedCommentRef.current = reportCommentStore.getState().reportedComment;

  const { mutateAsync: reportComment, isPending } = useMutation({
    ...commentMutationOptions.report(),
    onSuccess: () => {
      // ReportedComment 타입에 postId가 없어 detailKey(postId)로 좁힐 수 없다.
      // 신고 성공 시 전체 게시글 상세를 무효화해 신고 반영 여부를 반영한다.
      queryClient.invalidateQueries({
        queryKey: postQueries.details(),
      });
      Toast.show({
        message: "신고가 접수되었습니다.",
      });
      closeModal();
    },
    onError: () => {
      Toast.show({
        message: "신고 접수에 실패했습니다.",
      });
    },
  });

  const handleReportSubmit = handleSubmit(async ({ reportReason }) => {
    const reportedComment = reportedCommentRef.current;
    if (!reportedComment) return;

    await reportComment({
      commentId: reportedComment.commentId,
      selectedOption: reportReason,
    });
  });

  return {
    handleReportSubmit,
    isPending,
  };
}
