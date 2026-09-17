"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishPromotionForm } from "../../api/client";
import { promotionQueries } from "../../queries";

export type PublishPromotionFormSuccess = {
  formId: number;
  publicKey: string;
  publicUrl: string;
};

export function usePublishPromotionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["promotion", "publishForm"] as const,
    mutationFn: async ({
      formId,
      expectedVersion,
    }: {
      formId: number;
      expectedVersion: number;
    }) =>
      (await publishPromotionForm(
        formId,
        expectedVersion
      )) as PublishPromotionFormSuccess,
    onSuccess: (_data, { formId }) => {
      // 게시 후 떠나는 편집 화면에서 초안을 다시 조회하지 않음
      // 다음 진입 때 새로 조회
      void queryClient.invalidateQueries({
        queryKey: promotionQueries.formDraft(String(formId)).queryKey,
        refetchType: "none",
      });
      void queryClient.invalidateQueries({
        queryKey: promotionQueries.myFormList().queryKey,
      });
    },
    onError: (error: unknown) => {
      console.error("프로모션 게시 중 에러:", error);
    },
  });
}
