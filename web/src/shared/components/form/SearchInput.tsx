"use client";

import React, { forwardRef, useCallback, useMemo } from "react";
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
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClose,
      placeholder = "검색",
      variant = "default",
      ...rest
    },
    ref
  ) => {
    const isSearching = useMemo(
      () => value && typeof value === "string" && value.trim().length > 0,
      [value]
    );

    const handleClear = useCallback(() => {
      onChange?.({
        target: {
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }, [onChange]);

    const isMutedBar = variant === "mutedBar";

    return (
      <label
        htmlFor="search"
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
            <ChevronLeftIcon
              className={cn(
                "cursor-pointer text-grey-500",
                isMutedBar ? "size-[18px]" : "size-[20px]"
              )}
              onClick={onClose}
            />
          ) : (
            <MagnifyingGlassIcon
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
          name="search"
          id="search"
          value={value}
          onChange={onChange}
          className={cn(
            "h-full w-full flex-1 min-w-0 border-none bg-transparent outline-none",
            isMutedBar
              ? "py-0 text-base text-grey-800 placeholder:text-grey-500"
              : "rounded-[8px] px-[4px] py-[12px]"
          )}
          placeholder={placeholder}
          {...rest}
        />
        {isSearching && (
          <div
            className={cn(
              "flex shrink-0 cursor-pointer items-center justify-center",
              isMutedBar ? "pr-2" : "size-[24px] rounded-full bg-grey-100"
            )}
          >
            <XCircleIcon
              className={cn(
                "fill-grey-500",
                isMutedBar ? "size-[20px]" : "size-[22px]"
              )}
              onClick={handleClear}
            />
          </div>
        )}
      </label>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default React.memo(SearchInput);
