"use client";

import React, { forwardRef, useCallback, useId, useMemo } from "react";
import { InputHTMLAttributes } from "react";

import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

import { cn } from "@/shared/lib";

export type SearchInputVariant = "default" | "mutedBar";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClose?: () => void;
  variant?: SearchInputVariant;
  /**
   * 검색 필드 텍스트 크기
   */
  textSize?: "large" | "base" | "small";
}

function getTextSizeClassName(textSize: SearchInputProps["textSize"]) {
  switch (textSize) {
    case "large":
      return "text-[16px]";
    case "base":
      return "text-[14px]";
    case "small":
      return "text-[11px]";
    default:
      return "text-[14px]";
  }
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClose,
      placeholder = "검색",
      variant = "default",
      textSize = "base",
      id,
      name,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? (typeof name === "string" ? name : generatedId);

    const isSearching = useMemo(
      () => value && typeof value === "string" && value.trim().length > 0,
      [value]
    );

    const handleClear = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onChange?.({
          target: {
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>);
      },
      [onChange]
    );

    const isMutedBar = variant === "mutedBar";

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "flex w-full flex-row items-center justify-between",
          isMutedBar
            ? cn(
              "relative h-12 rounded-xl bg-grey-200 py-0 pl-12",
              isSearching ? "pr-2" : "pr-6"
            )
            : "rounded-[8px] bg-grey-100 px-[8px]"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            isMutedBar
              ? "pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2"
              : "size-[24px] rounded-full bg-grey-100"
          )}
        >
          {onClose && isSearching ? (
            <button
              type="button"
              aria-label="검색 닫기"
              onClick={onClose}
              className="flex items-center justify-center"
            >
              <ChevronLeftIcon
                aria-hidden
                className={cn(
                  "text-grey-500",
                  isMutedBar ? "size-[18px]" : "size-[20px]"
                )}
              />
            </button>
          ) : (
            <MagnifyingGlassIcon
              aria-hidden
              className={cn(
                "text-grey-500",
                isMutedBar ? "size-[18px]" : "size-[20px]"
              )}
            />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          name={name}
          id={inputId}
          value={value}
          onChange={onChange}
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            "h-full w-full flex-1 min-w-0 border-none bg-transparent outline-none",
            isMutedBar
              ? "py-0 text-base text-grey-800 placeholder:text-grey-500"
              : "rounded-[8px] px-[4px] py-[12px]",
            getTextSizeClassName(textSize)
          )}
          placeholder={placeholder}
          {...rest}
        />
        {isSearching && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={handleClear}
            onMouseDown={(event) => event.stopPropagation()}
            className={cn(
              "flex shrink-0 items-center justify-center",
              isMutedBar ? "pr-2" : "size-[24px] rounded-full bg-grey-100"
            )}
          >
            <XCircleIcon
              aria-hidden
              className={cn(
                "fill-grey-500",
                isMutedBar ? "size-[20px]" : "size-[22px]"
              )}
            />
          </button>
        )}
      </label>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default React.memo(SearchInput);
