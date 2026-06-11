"use client";

import React from "react";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

import { josa } from "es-hangul";

import { WarningCircleIcon } from "../Icons";

import "@/app/globals.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label?: string;
  errorMessage?: string | undefined;
  leadingComponent?: React.ReactNode;
  trailingComponent?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefCallback<HTMLInputElement | null>;
}
function Input(props: InputProps) {
  const {
    type = "text",
    label = "",
    errorMessage,
    leadingComponent,
    trailingComponent,
    placeholder = `${josa(label, "을/를")} 입력해주세요.`,
    onChange,
    ref,
    ...rest
  } = props;

  return (
    <label className="w-full" htmlFor={label}>
      <div className="flex flex-col gap-[4px]">
        {label.trim().length > 0 && (
          <span className="text-grey-500 px-[4px] text-[14px]">{label}{rest.required && <span className="text-red-500 ml-[4px]">*</span>}</span>
        )}
        <div
          className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] ${!!errorMessage
            ? "border-red-400"
            : "border-grey-300 focus-within:border-grey-500"
            } ${rest.disabled ? "bg-grey-100 text-grey-600 cursor-not-allowed border-grey-300" : ""
            }`}
        >
          {leadingComponent && (
            <span className="shrink-0 flex items-center">{leadingComponent}</span>
          )}
          <input
            ref={ref}
            placeholder={placeholder}
            onChange={onChange}
            type={type}
            id={label.trim().length > 0 ? label : undefined}
            {...rest}
            className={`flex-grow w-full outline-none placeholder-grey-300 text-grey-500 bg-transparent border-none h-full ${rest.disabled
              ? "placeholder:bg-grey-100 placeholder-grey-500"
              : ""
              } ${rest.className} `}
          />
          {trailingComponent && (
            <span className="shrink-0 flex items-center">{trailingComponent}</span>
          )}
        </div>
        {!!errorMessage && (
          <div className="flex flex-row items-center gap-[4px]">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <WarningCircleIcon className="size-full text-red-400" />
            </span>
            <div className="text-red-500 max-w-full text-[12px]">
              {errorMessage}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}

export default React.memo(Input);
