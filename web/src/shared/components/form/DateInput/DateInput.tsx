"use client";

import {
  InputHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { throttle } from "lodash";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { josa } from "es-hangul";

import { WarningCircleIcon } from "@/shared/components/Icons";
import { useClickOutside } from "@/shared/hooks";

import { DateFields } from "./DateFields";
import { useDateFieldNavigation } from "./useDateFieldNavigation";
import { useDateInput } from "./useDateInput";
import { DatePicker } from "../DatePicker";

interface DateInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  /** RHF field에서 넘겨받는 값 (YYYY-MM-DD) */
  value?: string;
  /** 날짜 선택 시 호출되는 함수 */
  onChange?: (date: string) => void;
  ref?: React.RefCallback<HTMLInputElement | null>;
  // format?: "YYYY-MM-DD" | "YYYY.MM.DD" | "YYYY/MM/DD" | "YYYY년 MM월 DD일";
}

export const DateInput = memo(function DateInput(props: DateInputProps) {
  const {
    label = "",
    errorMessage,
    placeholder = `${josa(label, "을/를")} 선택해주세요.`,
    onChange,
    value = "",
    // format = "YYYY-MM-DD",
    ref,
    id,
    name,
    disabled = false,
    className,
    ...rest
  } = props;

  const generatedId = useId();
  const fieldId = id ?? (typeof name === "string" ? name : generatedId);
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const hasLabel = label.trim().length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [isBelowHalf, setIsBelowHalf] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅들 사용
  const { currentDate, isValidDate, displayDate, handleFieldInput } = useDateInput({
    value,
    onChange,
  });

  const errorText =
    errorMessage ||
    (!isValidDate && displayDate ? "올바른 날짜를 입력해주세요." : "");
  const hasError = Boolean(errorText);

  const {
    yearRef,
    monthRef,
    dateRef,
    moveToNextField,
    handleFieldFocus,
    handleBeforeInput,
  } = useDateFieldNavigation();

  // 통합 입력 핸들러 - 최적화된 버전
  const handleInput = useCallback(
    (type: "year" | "month" | "day", inputText: string) => {
      const formattedValue = handleFieldInput(type, inputText);
      moveToNextField(type, formattedValue);
      return formattedValue;
    },
    [handleFieldInput, moveToNextField]
  );

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, [value]);

  useClickOutside({
    ref: targetRef,
    enabled: isOpen,
    onOutsideClick: closePicker,
  });

  // 스크롤시 위치 체크 - 최적화된 버전
  const checkPosition = useCallback(
    throttle(() => {
      if (!targetRef.current) return;

      const rect = targetRef.current.getBoundingClientRect();
      const { innerHeight } = window;

      if (rect.bottom < 0 || rect.top > innerHeight) {
        closePicker();
        return;
      }

      const isBelow = rect.top > innerHeight / 2;
      setIsBelowHalf(isBelow);
    }, 100),
    [closePicker]
  );

  useEffect(() => {
    if (isOpen) {
      checkPosition();
      window.addEventListener("scroll", checkPosition, {
        passive: true,
        capture: true,
      });
    }
    return () => {
      window.removeEventListener("scroll", checkPosition);
    };
  }, [isOpen, checkPosition]);

  const handleIconClick = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleDateSelect = (date: string) => {
    onChange?.(date);
    closePicker();
  };

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="flex flex-col gap-[4px]">
        {hasLabel && (
          <div
            id={labelId}
            className="text-grey-500 px-[4px] text-[14px]"
          >
            {label}
          </div>
        )}
        <div
          ref={targetRef}
          role="group"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={hasError ? errorId : undefined}
          aria-disabled={disabled || undefined}
          className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] hover:border-grey-500 ${hasError
              ? "border-red-400"
              : "border-grey-300 focus-within:border-grey-500"
            } ${disabled
              ? "bg-grey-100 text-grey-400 cursor-not-allowed"
              : "cursor-pointer"
            }`}
        >
          <DateFields
            currentDate={currentDate}
            yearRef={yearRef}
            monthRef={monthRef}
            dateRef={dateRef}
            onInput={handleInput}
            onFocus={handleFieldFocus}
            onBeforeInput={handleBeforeInput}
            disabled={disabled}
            describedBy={hasError ? errorId : undefined}
            isInvalid={hasError}
          />

          <input
            ref={ref}
            hidden
            readOnly
            placeholder={placeholder}
            type="text"
            disabled={disabled}
            {...rest}
            id={fieldId}
            name={name}
            tabIndex={-1}
            aria-hidden
            value={value}
          />

          <button
            type="button"
            aria-label={isOpen ? "달력 닫기" : "달력 열기"}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            disabled={disabled}
            onClick={handleIconClick}
            className={`size-8 p-1 flex items-center justify-center text-grey-300 ${disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:text-grey-500"
              }`}
          >
            <CalendarIcon className="size-full text-grey-300" aria-hidden />
          </button>

          {isOpen && (
            <div
              role="dialog"
              aria-label="달력"
              className={`absolute left-0 right-0 bg-background w-[320px] border-2 border-grey-300 rounded-lg shadow-lg z-50 ${isBelowHalf ? "bottom-full mb-2" : "top-full mt-2"
                }`}
              onClick={(event) => event.stopPropagation()}
            >
              <DatePicker
                key="date-picker"
                value={value}
                onChange={handleDateSelect}
              />
            </div>
          )}
        </div>
        {hasError && (
          <div className="flex flex-row items-center gap-[4px]">
            <span
              className="flex size-4 shrink-0 items-center justify-center"
              aria-hidden
            >
              <WarningCircleIcon className="size-full text-red-400" />
            </span>
            <div id={errorId} className="text-red-500 max-w-full text-[12px]">
              {errorText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
