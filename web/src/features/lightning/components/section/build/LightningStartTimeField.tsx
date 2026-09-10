"use client";

import Image from "next/image";

import checkMark from "@public/icons/checkMark.svg";

import { TimeInput } from "@/shared/components";

interface LightningStartTimeFieldProps {
  errorMessage?: string | undefined;
  isUndecided: boolean;
  minTime: string;
  onChange: (time: string) => void;
  onUndecidedChange: (undecided: boolean) => void;
  value: string;
}

export function LightningStartTimeField({
  errorMessage,
  isUndecided,
  minTime,
  onChange,
  onUndecidedChange,
  value,
}: LightningStartTimeFieldProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <TimeInput
        label="시작 시간"
        value={isUndecided ? "" : value}
        onChange={onChange}
        placeholder="미정"
        disabled={isUndecided}
        minTime={minTime}
        {...(errorMessage ? { errorMessage } : {})}
      />
      <label className="flex cursor-pointer flex-row items-center gap-2">
        <input
          type="checkbox"
          checked={isUndecided}
          onChange={(event) => onUndecidedChange(event.currentTarget.checked)}
          name="isStartTimeUndecided"
          className="peer hidden"
        />
        <div className="hidden size-5 items-center justify-center rounded-sm peer-checked:flex peer-checked:bg-black">
          <Image src={checkMark} width={12} height={12} alt="" />
        </div>
        <div className="block size-5 rounded-sm border border-grey-300 bg-background peer-checked:hidden" />
        <div className="text-[12px] text-grey-400 peer-checked:text-grey-800">
          미정
        </div>
      </label>
    </div>
  );
}
