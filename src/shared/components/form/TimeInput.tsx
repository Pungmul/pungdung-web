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
import { ClockIcon } from "@heroicons/react/24/outline";
import { josa } from "es-hangul";

import { WarningCircleIcon } from "@/shared/components/Icons";
import { useClickOutside } from "@/shared/hooks";

import { formatIntervalValue } from "./TimeInput/formatIntervalValue";
import { TimeFields } from "./TimeInput/TimeFields";
import { useTimeFieldNavigation } from "./TimeInput/useTimeFieldNavigation";
import { useTimeInput } from "./TimeInput/useTimeInput";
import { TimePicker } from "./TimePicker";

import "@/app/globals.css";

interface TimeInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  /** RHF field에서 넘겨받는 값 (HH:mm:ss) */
  value?: string | undefined;
  /** 시간 선택 시 호출되는 함수 */
  onChange?: (time: string) => void;
  ref?: React.RefCallback<HTMLInputElement | null>;
  /** 초 단위 표시 여부 */
  showSeconds?: boolean;
  /** 오전/오후 표시 여부 */
  showAmPm?: boolean;
  /** 최소 시간 (HH:mm) */
  minTime?: string;
  /** 최대 시간 (HH:mm) */
  maxTime?: string;
  /** 기본 값 (HH:mm) */
  defaultValue?: string;
}

export const TimeInput = memo(function TimeInput(props: TimeInputProps) {
  const {
    label = "",
    errorMessage,
    placeholder = `${josa(label, "을/를")} 선택해주세요.`,
    onChange,
    showSeconds = false,
    showAmPm = false,
    minTime = "",
    maxTime = "",
    defaultValue,
    value: valueFromProps,
    ref,
    ...rest
  } = props;

  /** DateInput과 같이 비어 있으면 필드 placeholder(HH/MM)만 보이게 함. `value` 미전달 시에만 `defaultValue` 사용 */
  const value =
    valueFromProps !== undefined ? valueFromProps : (defaultValue ?? "");

  const [isOpen, setIsOpen] = useState(false);
  const [isBelowHalf, setIsBelowHalf] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  // 커스텀 훅들 사용
  const { isValidTime, displayTime, handleFieldInput } = useTimeInput({
    value,
    onChange,
    showSeconds,
    showAmPm,
    minTime,
    maxTime,
  });

  const {
    hourRef,
    minuteRef,
    secondRef,
    ampmRef,
    moveToNextField,
    handleFieldFocus,
    handleBeforeInput,
  } = useTimeFieldNavigation({
    showSeconds,
    showAmPm,
  });

  // 통합 입력 핸들러 - AM/PM 지원 버전
  const handleInput = useCallback(
    (type: "hour" | "minute" | "second" | "ampm", inputText: string) => {
      const formattedValue = handleFieldInput(type, inputText);
      moveToNextField(type);
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

  const handleTimeSelect = (time: string) => {
    if (minTime && time < minTime) {
      onChange?.(formatIntervalValue(minTime, 5));
    } else if (maxTime && time > maxTime) {
      onChange?.(formatIntervalValue(maxTime, 5));
    } else {
      onChange?.(formatIntervalValue(time, 5));
    }
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
          className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] hover:border-grey-500 peer ${!!errorMessage
            ? "border-red-400"
            : "border-grey-300 focus-within:border-grey-500"
            } ${rest.disabled
              ? "bg-grey-100 text-grey-400 cursor-not-allowed"
              : "cursor-pointer"
            }`}
        >
          {/* 시간 입력 필드들 */}
          <TimeFields
            ref={targetRef}
            currentTime={displayTime}
            hourRef={hourRef}
            minuteRef={minuteRef}
            secondRef={secondRef}
            ampmRef={ampmRef}
            onInput={handleInput}
            onFocus={handleFieldFocus}
            onBeforeInput={handleBeforeInput}
            disabled={rest.disabled ?? false}
            showSeconds={showSeconds}
            showAmPm={showAmPm}
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
            className={`flex-grow w-full outline-none placeholder-grey-300 text-grey-500 bg-transparent border-none h-full cursor-pointer ${rest.disabled
              ? "placeholder:bg-grey-100 placeholder-grey-500 cursor-not-allowed"
              : ""
              } ${rest.className} `}
          />

          {/* 시계 아이콘 */}
          <span
            className={`size-8 flex items-center justify-center text-grey-300 ${rest.disabled
              ? "cursor-not-allowed"
              : "cursor-pointer hover:text-grey-500"
              }`}
            onClick={handleIconClick}
          >
            <ClockIcon className="size-full text-grey-300" />
          </span>

          {/* 드롭다운 시간 선택기 */}
          {isOpen && (
            <div
              className={`absolute left-0 right-0 bg-background w-fit border-2 border-grey-300 rounded-lg shadow-lg z-50 ${isBelowHalf ? "bottom-full mb-2" : "top-full mt-2"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <TimePicker
                key="time-picker"
                value={value}
                onChange={handleTimeSelect}
                showSeconds={showSeconds}
                showAmPm={showAmPm}
              />
            </div>
          )}
        </div>
        {(!!errorMessage || (!isValidTime && displayTime)) && (
          <div className="flex flex-row items-center gap-[4px]">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <WarningCircleIcon className="size-full text-red-400" />
            </span>
            <div className="text-red-500 max-w-full text-[12px]">
              {errorMessage || "올바른 시간을 입력해주세요."}
            </div>
          </div>
        )}
      </div>
    </label>
  );
});
