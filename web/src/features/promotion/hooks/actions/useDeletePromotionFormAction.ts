"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Alert, Toast } from "@/shared/store";

import { promotionMutationOptions, promotionQueries } from "../../queries";

const MY_PROMOTION_FORM_LIST_HREF =
  "/board/promote/l?tab=my-promotion-form-list";

export type RequestDeletePromotionFormParams = {
  formId: number;
  publicKey?: string | null;
  confirmTitle: string;
  confirmMessage: string;
};

export function useDeletePromotionFormAction() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    ...promotionMutationOptions.deleteForm(),
  });

  const requestDeleteForm = useCallback(
    ({
      formId,
      publicKey,
      confirmTitle,
      confirmMessage,
    }: RequestDeletePromotionFormParams) => {
      Alert.confirm({
        title: confirmTitle,
        message: confirmMessage,
        confirmText: "삭제",
        confirmColor: "var(--color-red-400)",
        onConfirm: () => {
          void (async () => {
            try {
              await mutateAsync({ formId });
              await queryClient.invalidateQueries({
                queryKey: promotionQueries.myFormList().queryKey,
              });
              await queryClient.invalidateQueries({
                queryKey: promotionQueries.list().queryKey,
              });
              router.replace(MY_PROMOTION_FORM_LIST_HREF);
              Toast.show({
                message: "공연이 삭제되었습니다.",
              });
              // 상세/초안 쿼리를 현재 화면에서 먼저 무효화하면 에러가 남
              // 목록 무효화와 replace 이후에 상세 캐시를 갱신
              setTimeout(() => {
                if (publicKey) {
                  void queryClient.invalidateQueries({
                    queryKey: promotionQueries.detail(publicKey).queryKey,
                  });
                }
                void queryClient.invalidateQueries({
                  queryKey: promotionQueries.formDraft(String(formId)).queryKey,
                });
                void queryClient.invalidateQueries({
                  queryKey: promotionQueries.formResponses(String(formId))
                    .queryKey,
                });
              }, 0);
            } catch (error) {
              Alert.alert({
                title: "오류",
                message: "삭제에 실패했습니다.",
                subMessage: error instanceof Error ? error.message : "",
              });
            }
          })();
        },
      });
    },
    [mutateAsync, queryClient, router]
  );

  return { requestDeleteForm, isPending };
}
