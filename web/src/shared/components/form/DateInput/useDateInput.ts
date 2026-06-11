import { useCallback,useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import {
  clampFieldValue,
  FIELD_CONFIGS,
  isFieldFull,
  parseDateString,
} from "./utils";

export interface UseDateInputProps {
  value?: string;
  onChange?: ((date: string) => void) | undefined;
}

export function useDateInput({ value = "", onChange }: UseDateInputProps) {
  // 현재 타이핑 중인 날짜 (valid하지 않아도 저장)
  const [typeDate, setTypeDate] = useState<string>(value);

  // 현재 표시할 날짜 값들 (타이핑 중이면 typeDate, 아니면 value)
  const displayDate = useMemo(() => {
    return typeDate || value || "";
  }, [typeDate, value]);

  // 현재 날짜 값들을 파싱 (displayDate 기준) - 최적화된 파싱
  const currentDate = useMemo(() => {
    if (!displayDate) return { year: "YYYY", month: "MM", day: "DD" };

    // 빠른 문자열 파싱 (dayjs 호출 최소화)
    const parsed = parseDateString(displayDate);

    // 유효성 검사와 포맷팅을 한 번에 처리
    const isValid = dayjs(displayDate).isValid();
    if (isValid) {
      return {
        year: (parsed.year || "").padStart(4, "0"),
        month: (parsed.month || "").padStart(2, "0"),
        day: (parsed.day || "").padStart(2, "0"),
      };
    }

    return parsed;
  }, [displayDate]);

  // 현재 날짜가 유효한지 확인 (캐시된 결과 사용)
  const isValidDate = useMemo(() => {
    if (!displayDate) return true;
    return dayjs(displayDate).isValid();
  }, [displayDate]);

  // value 변경시 타이핑 상태 초기화
  useEffect(() => {
    setTypeDate(value);
  }, [value]);

  // 각 필드의 값 업데이트 - 최적화된 버전
  const updateFieldValue = useCallback(
    (type: "year" | "month" | "day", newValue: string) => {
      // 0 값 체크를 먼저 수행하여 불필요한 연산 방지
      if (Number(newValue) === 0) return;

      const updatedDate = { ...currentDate, [type]: newValue };
      const newDateString = `${updatedDate.year}-${updatedDate.month}-${updatedDate.day}`;

      // 타이핑 중인 날짜 업데이트 (valid하지 않아도 저장)
      setTypeDate(newDateString);

      // 유효한 날짜일 때만 onChange 호출 (dayjs 호출 최소화)
      const isValid = dayjs(newDateString).isValid();
      if (isValid) {
        onChange?.(newDateString);
      }
    },
    [currentDate, onChange]
  );

  // 최적화된 필드 입력 처리
  const handleFieldInput = useCallback(
    (type: "year" | "month" | "day", inputText: string) => {
      const numeric = inputText.replace(/\D/g, "");
      const lastChar = numeric[numeric.length - 1];

      if (!lastChar) {
        return type === "year" ? "YYYY" : type === "month" ? "MM" : "DD";
      }

      // 현재 필드 값 - 최적화된 접근
      const fieldMap = {
        year: currentDate.year === "YYYY" ? "0000" : currentDate.year,
        month: currentDate.month === "MM" ? "00" : currentDate.month,
        day: currentDate.day === "DD" ? "00" : currentDate.day,
      };
      const prev = fieldMap[type];

      // 꽉 찬 상태 판단 최적화
      const prevNum = parseInt(prev, 10);
      const isFull = isFieldFull(type, prev, prevNum);

      // 결과 계산 최적화
      const config = FIELD_CONFIGS[type];
      const result = isFull
        ? lastChar.padStart(config.length, "0")
        : (prev.slice(1) + lastChar).padStart(config.length, "0");

      // 범위 제한 최적화
      const clamped = clampFieldValue(type, result);

      updateFieldValue(type, clamped);
      return clamped;
    },
    [updateFieldValue, currentDate]
  );

  return {
    currentDate,
    isValidDate,
    displayDate,
    handleFieldInput,
    setTypeDate,
  };
}
