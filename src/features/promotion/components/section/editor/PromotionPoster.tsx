"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Controller, useFormContext } from "react-hook-form";

import { PhotoIcon } from "@heroicons/react/24/outline";

import { Spinner } from "@/shared";

import { usePromotionPosterUploadAction } from "../../../hooks/actions";
import type { PromotionPostingFormValues } from "../../../types/promotion-posting-form.types";

export const PromotionPosterForm = () => {
  const { control } = useFormContext<PromotionPostingFormValues>();
  const formId = useSearchParams().get("formId");
  const {
    isUploadPending,
    handlePosterFileInputChange,
    posterInputAccept,
  } = usePromotionPosterUploadAction(formId);

  return (
    <Controller
      name="poster"
      control={control}
      render={({ field }) => (
        <div className="flex flex-row w-full justify-between max-w-[640px] min-w-[320px] mx-auto gap-[12px] h-[216px] md:h-[320px]">
          <div className="relative flex flex-col h-full bg-grey-200 rounded-md aspect-[7/10] border border-grey-300 overflow-hidden">
            {field.value?.imageUrl ? (
              <div className="relative flex flex-col h-full bg-white">
                <Image
                  src={field.value.imageUrl}
                  alt="promotion poster"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="size-8 flex items-center justify-center">
                  <PhotoIcon className="size-full" color="#CCCCCC" />
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col h-full justify-end">
            <div className="relative flex w-full flex-row items-center justify-between gap-[8px]">
              <label
                htmlFor="promotion-poster-file-input"
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="flex w-fit flex-wrap items-center justify-center gap-x-[4px] px-[8px] py-[6px] rounded-md bg-grey-800">
                  {isUploadPending ? (
                    <Spinner size={16} />
                  ) : (
                    <span className="w-fit truncate text-center text-[14px] font-semibold leading-snug text-background break-keep text-balance">
                      포스터 업로드
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  className="sr-only"
                  id="promotion-poster-file-input"
                  disabled={isUploadPending}
                  accept={posterInputAccept}
                  onChange={(e) =>
                    void handlePosterFileInputChange(e, field.onChange)
                  }
                />
              </label>
              <button
                type="button"
                className="h-full py-[4px] px-[8px] w-fit self-center border border-grey-500 rounded-md text-grey-500 text-[14px] font-semibold"
                onClick={() => field.onChange(null)}
                disabled={isUploadPending}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    />
  );
};
