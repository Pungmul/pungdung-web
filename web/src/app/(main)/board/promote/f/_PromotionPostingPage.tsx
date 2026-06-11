"use client";
import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { PromotionPostingForm, promotionQueries } from "@/features/promotion";

import { Spinner } from "@/shared";

export function PromotionPostingPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const { data: form, isLoading: isFormLoading } = useQuery({
    ...promotionQueries.formDraft(formId ?? ""),
    enabled: Boolean(formId),
  });

  if (!formId) return null;
  if (isFormLoading)
    return (
      <div className="flex flex-1 items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  if (!form)
    return (
      <div className="flex items-center justify-center h-full w-full">
        폼을 찾을 수 없습니다.
      </div>
    );
  return <PromotionPostingForm form={form} />;
}
