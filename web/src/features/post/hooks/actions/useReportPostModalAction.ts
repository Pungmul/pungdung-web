"use client";

import { useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UseFormHandleSubmit } from "react-hook-form";

import { Toast } from "@/shared/store";

import { reportPostRequestBodySchema } from "../../api/client/dto.schema";
import { postMutationOptions, postQueries } from "../../queries";
import { reportPostStore } from "../../store";
import type { ReportPostModalFormValues } from "../../types/schemas";

interface UseReportPostModalActionParams {
  closeModal: () => void;
  handleSubmit: UseFormHandleSubmit<ReportPostModalFormValues>;
}

export function useReportPostModalAction({
  closeModal,
  handleSubmit,
}: UseReportPostModalActionParams) {
  const queryClient = useQueryClient();

  const reportedPostRef = useRef(reportPostStore.getState().reportedPost);
  reportedPostRef.current = reportPostStore.getState().reportedPost;

  const { mutateAsync: reportPostRequest, isPending } = useMutation({
    ...postMutationOptions.report(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
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

  const onSubmit = handleSubmit(async (values) => {
    const reportedPost = reportedPostRef.current;
    if (!reportedPost) return;

    const body = reportPostRequestBodySchema.parse({
      reportReason: values.reportReason,
    });

    await reportPostRequest({
      postId: reportedPost.postId,
      selectedOption: body.reportReason,
    });
  });

  return {
    onSubmit,
    isPending,
  };
}
