"use client";

import { useCallback } from "react";

import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { Toast } from "@/shared";

import { promotionMutationOptions } from "../../queries";
import type { PromotionFormSavePayload } from "../../types";

export type SavePromotionFormDraftParams = {
  formId: number | string | null | undefined;
  form: PromotionFormSavePayload;
  /** 기본값 true — Save Draft 성공/실패 토스트 */
  showToast?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

function normalizeFormId(
  formId: SavePromotionFormDraftParams["formId"]
): number | null {
  if (formId === null || formId === undefined || formId === "") {
    return null;
  }
  const id = typeof formId === "string" ? Number(formId) : formId;
  return Number.isFinite(id) ? id : null;
}

export function useSavePromotionFormDraft() {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    ...promotionMutationOptions.saveForm(),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["promotion", "formDraft", String(variables.formId)],
      });
      void queryClient.invalidateQueries({
        queryKey: ["myPromotionFormList"],
      });
    },
    onError: (error) => {
      console.error("폼 저장 중 에러:", error);
    },
  });

  const handleSaveDraft = useCallback(
    async ({
      formId,
      form,
      showToast = true,
      onSuccess,
      onError,
    }: SavePromotionFormDraftParams) => {
      const id = normalizeFormId(formId);
      if (id === null) {
        return;
      }

      try {
        await mutation.mutateAsync({ formId: id, form });
        if (showToast) {
          Toast.show({
            message: "임시 저장 완료",
            type: "success",
            duration: 3000,
          });
        }
        onSuccess?.();
      } catch (error) {
        if (showToast) {
          Toast.show({
            message: "임시 저장 실패",
            type: "error",
            duration: 3000,
          });
        }
        onError?.(error);
      }
    },
    [mutation]
  );

  return {
    ...mutation,
    handleSaveDraft,
  };
}
