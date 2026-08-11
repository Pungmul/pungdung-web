"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { ChipButton, ListEmptyView } from "@/shared/components";

import { promotionMutationOptions } from "../../../../queries/promotion.mutation";
import { promotionQueries } from "../../../../queries/promotion.query";

const EMPTY_MESSAGE = "현재 모집중인 공연이 없어요.";

export function EmptyList({ isGuest }: { isGuest: boolean }) {
  return (
    <ListEmptyView
      message={EMPTY_MESSAGE}
      action={isGuest ? undefined : <CreatePromotionChip />}
    />
  );
}

function CreatePromotionChip() {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { mutate: createPromotion, isPending } = useMutation({
    ...promotionMutationOptions.createPromotion(),
    onSuccess: async (formId: number) => {
      await queryClient.invalidateQueries({
        queryKey: promotionQueries.myFormList().queryKey,
      });
      router.push(`/board/promote/f?formId=${formId}`);
    },
  });

  return (
    <ChipButton
      filled
      disabled={isPending}
      onClick={() => createPromotion()}
    >
      새로운 공연 등록하기
    </ChipButton>
  );
}
