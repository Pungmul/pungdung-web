import { forwardRef } from "react";

import { FieldType } from "@/shared/types";

import { DateField } from "./DateField";

type DateFieldType = Extract<FieldType, "year" | "month" | "day">;

interface DateFieldsProps {
  currentDate: {
    year: string;
    month: string;
    day: string;
  };
  yearRef: React.RefObject<HTMLSpanElement | null>;
  monthRef: React.RefObject<HTMLSpanElement | null>;
  dateRef: React.RefObject<HTMLSpanElement | null>;
  onInput: (type: DateFieldType, inputText: string) => string;
  onFocus: (e: React.FocusEvent<HTMLSpanElement>) => void;
  onBeforeInput: (e: React.FormEvent<HTMLSpanElement>) => void;
  disabled?: boolean;
  describedBy?: string;
  isInvalid?: boolean;
}

export const DateFields = forwardRef<HTMLDivElement, DateFieldsProps>(
  (
    {
      currentDate,
      yearRef,
      monthRef,
      dateRef,
      onInput,
      onFocus,
      onBeforeInput,
      disabled,
      describedBy,
      isInvalid,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="flex flex-grow items-center text-grey-500 bg-transparent border-none h-full"
      >
        <DateField
          ref={yearRef}
          type="year"
          value={currentDate.year}
          tabIndex={disabled ? -1 : 0}
          onInput={onInput}
          onFocus={onFocus}
          onBeforeInput={onBeforeInput}
          describedBy={describedBy}
          isInvalid={isInvalid}
          className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[40px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
        />
        <span className="text-grey-400 mx-1" aria-hidden>
          /
        </span>
        <DateField
          ref={monthRef}
          type="month"
          value={currentDate.month}
          tabIndex={disabled ? -1 : 0}
          onInput={onInput}
          onFocus={onFocus}
          onBeforeInput={onBeforeInput}
          describedBy={describedBy}
          isInvalid={isInvalid}
          className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[24px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
        />
        <span className="text-grey-400 mx-1" aria-hidden>
          /
        </span>
        <DateField
          ref={dateRef}
          type="day"
          value={currentDate.day}
          tabIndex={disabled ? -1 : 0}
          onInput={onInput}
          onFocus={onFocus}
          onBeforeInput={onBeforeInput}
          describedBy={describedBy}
          isInvalid={isInvalid}
          className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[24px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
        />
      </div>
    );
  }
);

DateFields.displayName = "DateFields";
