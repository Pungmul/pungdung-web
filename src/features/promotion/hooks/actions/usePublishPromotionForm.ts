"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  publishPromotionForm,
  savePromotionForm,
} from "../../api/client";
import type { PromotionFormSavePayload } from "../../types";

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
      form,
    }: {
      formId: number;
      form: PromotionFormSavePayload;
    }) => {
      const saveRes = await savePromotionForm(formId, form);
      const submitData = (await publishPromotionForm(
        formId,
        saveRes.version
      )) as PublishPromotionFormSuccess;
      return submitData;
    },
    onSuccess: (_data, { formId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["promotion", "formDraft", String(formId)],
      });
      void queryClient.invalidateQueries({
        queryKey: ["myPromotionFormList"],
      });
    },
    onError: (error: unknown) => {
      console.error("프로모션 게시 중 에러:", error);
    },
  });
}
