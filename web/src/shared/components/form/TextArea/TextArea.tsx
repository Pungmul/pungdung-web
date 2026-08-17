"use client";

import { InputHTMLAttributes, useId } from "react";
import Image from "next/image";

import WarningCircleIcon from "@public/icons/Warning-circle-icon.svg";
import { josa } from "es-hangul";

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  className?: string;
  label: string;
  errorMessage?: string;
  noLabel?: boolean;
  bgColor?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export function TextArea(props: TextAreaProps) {
  const {
    className,
    label,
    errorMessage,
    bgColor = "bg-white",
    placeholder = `${josa(label, "을/를")} 입력해주세요.`,
    onChange,
    noLabel = false,
    id,
    name,
    ...rest
  } = props;

  const generatedId = useId();
  const textareaId = id ?? (typeof name === "string" ? name : generatedId);
  const errorId = `${textareaId}-error`;

  return (
    <div className="w-full flex-grow relative">
      <div className="flex-grow">
        {!noLabel && (
          <label
            htmlFor={textareaId}
            className="text-grey-500 pl-[4px] text-[14px]"
          >
            {label}
          </label>
        )}
        <div
          className={`flex flex-row flex-grow border box-border ${bgColor} ${errorMessage ? "border-2 border-red-400" : "border-grey-500"
            }`}
          style={{ gap: 8, padding: "8px 8px", borderRadius: 5 }}
        >
          <textarea
            className={`flex-grow outline-none placeholder-grey-300 text-grey-500 resize-y h-full ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            {...rest}
            id={textareaId}
            name={name}
            aria-describedby={errorMessage ? errorId : undefined}
          />
        </div>
        {errorMessage && (
          <div
            className="flex flex-row items-center"
            style={{ gap: 4 }}
          >
            <Image src={WarningCircleIcon} width={12} alt="" aria-hidden />
            <div
              id={errorId}
              className="text-red-500 max-w-full"
              style={{ fontSize: 12, lineHeight: "15px" }}
            >
              {errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
