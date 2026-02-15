"use client";

import {
  InputHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { throttle } from "lodash";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { josa } from "es-hangul";

import { WarningCircleIcon } from "@/shared/components/Icons";
import { useClickOutside } from "@/shared/hooks";

import { DateFields } from "./DateInput/DateFields";
import { useDateFieldNavigation } from "./DateInput/useDateFieldNavigation";
import { useDateInput } from "./DateInput/useDateInput";
import { DatePicker } from "./DatePicker";

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
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isBelowHalf, setIsBelowHalf] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅들 사용
  const { currentDate, isValidDate, displayDate, handleFieldInput } = useDateInput({
    value,
    onChange,
  });

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
    if (!rest.disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleDateSelect = (date: string) => {
    onChange?.(date);
    closePicker();
  };

  return (
    <label className="w-full" htmlFor={label}>
      <div className="flex flex-col gap-[4px]">
        {label.trim().length > 0 && (
          <div className="text-grey-500 px-[4px] text-[14px]">{label}</div>
        )}
        <div
          ref={targetRef}
          className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] hover:border-grey-500 ${
            !!errorMessage
              ? "border-red-400"
              : "border-grey-300 focus-within:border-grey-500"
          } ${
            rest.disabled
              ? "bg-grey-100 text-grey-400 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {/* 날짜 입력 필드들 */}
          <DateFields
            currentDate={currentDate}
            yearRef={yearRef}
            monthRef={monthRef}
            dateRef={dateRef}
            onInput={handleInput}
            onFocus={handleFieldFocus}
            onBeforeInput={handleBeforeInput}
            disabled={rest.disabled ?? false}
          />

          {/* 숨겨진 input (form 제출용) */}
          <input
            ref={ref}
            hidden={true}
            placeholder={placeholder}
            type="text"
            id={label}
            readOnly
            {...rest}
            value={value}
            className={`flex-grow w-full outline-none placeholder-grey-300 text-grey-500 bg-transparent border-none h-full cursor-pointer ${
              rest.disabled
                ? "placeholder:bg-grey-100 placeholder-grey-500 cursor-not-allowed"
                : ""
            } ${rest.className} `}
          />

          {/* 캘린더 아이콘 */}
          <span
            className={`size-[32px] p-[4px] flex items-center justify-center text-grey-300 ${
              rest.disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:text-grey-500"
            }`}
            onClick={handleIconClick}
          >
            <CalendarIcon />
          </span>

          {/* 드롭다운 달력 */}
          {isOpen && (
            <div
              className={`absolute left-0 right-0 bg-background w-[320px] border-2 border-grey-300 rounded-lg shadow-lg z-50 ${
                isBelowHalf ? "bottom-full mb-2" : "top-full mt-2"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <DatePicker
                key="date-picker"
                value={value}
                onChange={handleDateSelect}
              />
            </div>
          )}
        </div>
        {(!!errorMessage || (!isValidDate && displayDate)) && (
          <div className="flex flex-row items-center gap-[4px]">
            <WarningCircleIcon className="text-red-400" />
            <div className="text-red-500 max-w-full text-[12px]">
              {errorMessage || "올바른 날짜를 입력해주세요."}
            </div>
          </div>
        )}
      </div>
    </label>
  );
});
