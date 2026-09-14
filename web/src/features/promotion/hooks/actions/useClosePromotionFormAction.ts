"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Alert, Toast } from "@/shared/store";

import { promotionMutationOptions, promotionQueries } from "../../queries";
import type { PromotionDetail } from "../../types";

export type RequestClosePromotionFormParams = {
  formId: number;
  publicKey: string;
};

export function useClosePromotionFormAction() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    ...promotionMutationOptions.closeForm(),
  });

  const requestCloseForm = useCallback(
    ({ formId, publicKey }: RequestClosePromotionFormParams) => {
      Alert.confirm({
        title: "모집 중단",
        message: "공연 모집을 중단할까요?",
        confirmText: "중단",
        confirmColor: "var(--color-red-400)",
        onConfirm: () => {
          void (async () => {
            try {
              await mutateAsync({ formId });
              queryClient.setQueryData<PromotionDetail>(
                promotionQueries.detail(publicKey).queryKey,
                (current) =>
                  current ? { ...current, status: "CLOSED" } : current
              );
              await queryClient.invalidateQueries({
                queryKey: promotionQueries.detail(publicKey).queryKey,
              });
              await queryClient.invalidateQueries({
                queryKey: promotionQueries.myFormList().queryKey,
              });
              await queryClient.invalidateQueries({
                queryKey: promotionQueries.list().queryKey,
              });
              Toast.show({
                message: "모집이 중단되었습니다.",
              });
            } catch (error) {
              Alert.alert({
                title: "오류",
                message: "모집 중단에 실패했습니다.",
                subMessage: error instanceof Error ? error.message : "",
              });
            }
          })();
        },
      });
    },
    [mutateAsync, queryClient]
  );

  return { requestCloseForm, isPending };
}
