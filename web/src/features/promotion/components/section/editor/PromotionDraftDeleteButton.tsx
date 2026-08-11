"use client";

import { useCallback } from "react";

import { Button } from "@/shared";

import { useDeletePromotionFormAction } from "../../../hooks/actions";

type PromotionDraftDeleteButtonProps = {
  formId: string;
};

export function PromotionDraftDeleteButton({
  formId,
}: PromotionDraftDeleteButtonProps) {
  const { requestDeleteForm, isPending } = useDeletePromotionFormAction();

  const handleDeleteDraft = useCallback(() => {
    requestDeleteForm({
      formId: Number(formId),
      confirmTitle: "공연 삭제",
      confirmMessage: "작성 중인 공연을 삭제할까요?",
    });
  }, [formId, requestDeleteForm]);

  return (
    <div className="pt-[24px] relative w-full max-w-[640px] min-w-[320px] mx-auto">
      <Button
        type="button"
        disabled={isPending}
        className="bg-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
        onClick={handleDeleteDraft}>
        작성중인 공연 삭제
      </Button>
    </div>
  );
}
