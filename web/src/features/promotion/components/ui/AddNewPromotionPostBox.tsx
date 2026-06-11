"use client";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { PlusIcon } from "@heroicons/react/24/solid";

import { getQueryClient } from "@/core";

import { Spinner } from "@/shared";

import { promotionMutationOptions } from "../../queries/promotion.mutation";
import { promotionQueries } from "../../queries/promotion.query";

export function AddNewPromotionPostBox() {
  const router = useRouter();
  const queryClient = getQueryClient();

  const { mutate: createPromotion, isPending: isCreatePromotionPending } =
    useMutation({
      ...promotionMutationOptions.createPromotion(),
      onSuccess: async (formId: number) => {
        await queryClient.invalidateQueries({
          queryKey: promotionQueries.myFormList().queryKey,
        });
        router.push(`/board/promote/f?formId=${formId}`);
      },
    });

  const handleCreatePromotion = () => {
    createPromotion();
  };

  return (
    <div
      onClick={() => {
        if (isCreatePromotionPending) return;
        handleCreatePromotion();
      }}
      className="relative w-full bg-background p-[12px] cursor-pointer group"
    >
      <section className="w-full flex flex-col gap-[12px]">
        <div className="relative w-full aspect-[240/340] bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 transition-all duration-200 group-hover:scale-105 flex justify-center items-center">
          {isCreatePromotionPending ? (
            <Spinner size={64} baseColor="#FFFFFF" highlightColor="#FF816D" />
          ) : (
            <span className="size-16 flex items-center justify-center">
              <PlusIcon className="size-full text-grey-400" />
            </span>
          )}
        </div>
        <div className="flex-grow w-full flex justify-between flex-col items-start gap-[8px]">
          <div className="line-clamp-2 font-semibold text-[17px] leading-[24px] text-grey-800">
            새로운 공연 등록하기
          </div>
        </div>
      </section>
    </div>
  );
}
