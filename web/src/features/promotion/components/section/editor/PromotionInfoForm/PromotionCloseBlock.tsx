"use client";

import { useEffect, useState } from "react";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import dayjs from "dayjs";

import { Toast } from "@/shared";
import { DateInput, TimeInput } from "@/shared/components/form";

import {
  CLOSE_AT_FORMAT,
  promotionCloseDateBounds,
  resolvePromotionCloseAt,
} from "../../../../services/default-promotion-close-at";
import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

export const PromotionCloseBlock = () => {
  const { control, setValue } = useFormContext<PromotionPostingFormValues>();
  const performanceDate = useWatch({ control, name: "date" }) ?? "";
  const closeAt = useWatch({ control, name: "closeAt" }) ?? "";
  const [closeDateInputKey, setCloseDateInputKey] = useState(0);
  const today = dayjs().format("YYYY-MM-DD");
  const hasSelectableDate = Boolean(
    performanceDate && promotionCloseDateBounds(performanceDate, today)
  );
  const disabled = !hasSelectableDate;
  const resolvedCloseAt = performanceDate
    ? resolvePromotionCloseAt({ performanceDate, closeAt, today })
    : "";

  useEffect(() => {
    if (!performanceDate || resolvedCloseAt === closeAt) return;
    setValue("closeAt", resolvedCloseAt, { shouldDirty: false });
  }, [closeAt, performanceDate, resolvedCloseAt, setValue]);

  const closeDate = resolvedCloseAt
    ? dayjs(resolvedCloseAt).format("YYYY-MM-DD")
    : "";
  const closeTime = resolvedCloseAt
    ? dayjs(resolvedCloseAt).format("HH:mm")
    : "";

  const rejectCloseDate = () => {
    Toast.show({
      message: "모집 종료일은 내일부터 공연 전날까지만 선택할 수 있습니다.",
      type: "error",
    });
    setCloseDateInputKey((key) => key + 1);
  };

  return (
    <Controller
      name="closeAt"
      control={control}
      render={({ field }) => (
        <div className="w-full flex flex-row flex-wrap md:flex-nowrap items-start justify-start gap-x-4 gap-y-5 md:gap-y-6">
          <DateInput
            key={closeDateInputKey}
            label="모집 종료 날짜"
            placeholder="모집 종료 날짜를 입력해주세요."
            className="grow"
            disabled={disabled}
            value={closeDate}
            onChange={(date) => {
              const bounds = promotionCloseDateBounds(performanceDate, today);
              if (!bounds || date < bounds.min || date > bounds.max) {
                rejectCloseDate();
                return;
              }
              field.onChange(
                dayjs(`${date}T${closeTime || "00:00"}`).format(CLOSE_AT_FORMAT)
              );
            }}
          />
          <TimeInput
            label="모집 종료 시간"
            placeholder="모집 종료 시간을 입력해주세요."
            className="grow"
            disabled={disabled}
            value={closeTime}
            showAmPm={true}
            onChange={(time) => {
              if (!closeDate) return;
              field.onChange(
                resolvePromotionCloseAt({
                  performanceDate,
                  closeAt: dayjs(`${closeDate}T${time}`).format(CLOSE_AT_FORMAT),
                  today,
                })
              );
            }}
          />
        </div>
      )}
    />
  );
};
