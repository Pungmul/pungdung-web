"use client";

import { Controller, useFormContext } from "react-hook-form";

import dayjs from "dayjs";

import { DateInput, TimeInput } from "@/shared/components/form";

import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

/**
 * 공연 일정 블록 — 날짜, 시간 필드.
 */
export const PromotionScheduleBlock = () => {
  const { control, watch } = useFormContext<PromotionPostingFormValues>();

  return (
    <div className="w-full flex flex-row flex-wrap md:flex-nowrap items-start justify-start gap-x-4 gap-y-5 md:gap-y-6">
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DateInput
            label="날짜"
            placeholder="날짜를 입력해주세요."
            className="grow"
            value={field.value}
            onChange={(date) => {
              const time = watch("time");
              const [year, month, day] = date.split("-");
              if (!year || !month || !day) return;
              const newDate = dayjs(`${year}-${month}-${day}T${time}`)
                .set("year", parseInt(year, 10))
                .set("month", parseInt(month, 10) - 1)
                .set("date", parseInt(day, 10));
              field.onChange(newDate.format("YYYY-MM-DD"));
            }}
          />
        )}
      />
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <TimeInput
            label="공연 시간"
            placeholder="공연 시간을 입력해주세요."
            className="grow"
            value={field.value}
            showAmPm={true}
            onChange={(time) => {
              const date = watch("date");
              const [hour, minute] = time.split(":");
              if (!hour || !minute) return;
              const newDate = dayjs(`${date}T${time}`)
                .set("hour", parseInt(hour, 10))
                .set("minute", parseInt(minute, 10))
                .set("second", 0)
                .set("millisecond", 0);
              field.onChange(newDate.format("HH:mm:ss"));
            }}
          />
        )}
      />
    </div>
  );
};
