"use client";

import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

import { cn } from "@/shared/lib";

interface BoardHeaderSearchFieldProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSubmitSearch: () => void;
  onClear: () => void;
  containerClassName?: string;
}

export function BoardHeaderSearchField({
  searchValue,
  onSearchValueChange,
  onSubmitSearch,
  onClear,
  containerClassName,
}: BoardHeaderSearchFieldProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-[8px] p-[8px] rounded-md bg-grey-200 border border-grey-200 focus-within:border-grey-400 w-full",
        containerClassName
      )}
    >
      <input
        type="text"
        className="flex-grow bg-transparent outline-none peer font-light"
        placeholder="검색"
        value={searchValue}
        onChange={(e) => {
          onSearchValueChange(e.target.value);
        }}
      />
      {searchValue.trim() !== "" && (
        <>
          <XCircleIcon
            className="w-[24px] h-[24px] cursor-pointer peer text-grey-400"
            width={24}
            height={24}
            onClick={onClear}
          />
          <ArrowRightIcon
            className="w-[24px] h-[24px] cursor-pointer text-grey-400"
            onClick={onSubmitSearch}
            width={24}
            height={24}
          />
        </>
      )}
    </div>
  );
}
