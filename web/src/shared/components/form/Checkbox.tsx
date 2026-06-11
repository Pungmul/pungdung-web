"use client";

import { InputHTMLAttributes } from "react";

import { CheckIcon } from "@heroicons/react/24/outline";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  /** RHF field에서 넘겨받는 값 */
  value?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  required?: boolean;
  className?: string;
}

export function Checkbox({
  value = false,
  onChange,
  label,
  required = false,
  className = "",
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={`flex w-full flex-row items-center cursor-pointer gap-[8px] rounded-[5px] px-[16px] py-[16px] ${className}`}
    >
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange?.(e.target.checked)}
        className="hidden peer"
        {...rest}
      />

      <div className="hidden size-4 peer-checked:flex items-center justify-center rounded-sm bg-primary">
        <CheckIcon className="size-[12px] text-white stroke-[4px]" />
      </div>
      <div className="block border border-grey-400 peer-checked:hidden rounded-sm bg-[#FFFFFF] w-[16px] h-[16px]" />

      <div className="flex flex-row items-center text-grey-500 peer-checked:text-grey-800 peer-checked:font-semibold gap-[4px]">
        <div className="text-[14px] leading-[16px]">{label}</div>
        {required && (
          <div className="text-warning text-[14px] leading-[16px] font-medium">
            (필수)
          </div>
        )}
      </div>
    </label>
  );
}
