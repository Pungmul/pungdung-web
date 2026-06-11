"use client";

import Image from "next/image";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import checkMark from "@public/icons/checkMark.svg";

import { Input } from "@/shared";

import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

/**
 * 인원 제한 블록 — 제한 인원, 제한 없음 체크박스.
 */
export const PromotionPersonnelBlock = () => {
  const { control } = useFormContext<PromotionPostingFormValues>();
  const isUnlimitedPersonnel = useWatch({
    control,
    name: "isUnlimitedPersonnel",
  });

  return (
    <div className="w-full flex flex-col justify-between items-start gap-[8px]">
      <Controller
        name="limitPersonnel"
        control={control}
        render={({ field }) => (
          <Input
            label="제한 인원"
            placeholder={
              isUnlimitedPersonnel ? "제한 없음" : "제한 인원을 입력해주세요."
            }
            className="w-full disabled:text-grey-400 disabled:cursor-not-allowed"
            type="number"
            disabled={isUnlimitedPersonnel}
            value={isUnlimitedPersonnel ? "" : field.value.toString()}
            onChange={(e) =>
              field.onChange(parseInt(e.target.value || "0", 10))
            }
          />
        )}
      />
      <Controller
        name="isUnlimitedPersonnel"
        control={control}
        render={({ field }) => (
          <label className="flex flex-row gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              name="isUnlimitedPersonnel"
              id="isUnlimitedPersonnel"
              className="hidden peer"
            />
            <div className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center peer-checked:bg-black">
              <Image src={checkMark} width={12} height={12} alt="" />
            </div>
            <div className="block w-5 h-5 bg-background border border-grey-300 peer-checked:hidden rounded-sm" />
            <div className="text-grey-400 peer-checked:text-grey-800 text-[12px]">
              제한 없음
            </div>
          </label>
        )}
      />
    </div>
  );
};
