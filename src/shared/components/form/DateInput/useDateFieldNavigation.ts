import { useCallback,useRef } from "react";

import { shouldMoveToNextField } from "./utils";

type DateFiledType = "year" | "month" | "day";

export function useDateFieldNavigation() {
  const yearRef = useRef<HTMLSpanElement>(null);
  const monthRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);

  // 포커스 이동 처리 - 최적화된 버전
  const moveToNextField = useCallback((type: DateFiledType, value: string) => {
    const refs: Record<
      DateFiledType,
      React.RefObject<HTMLSpanElement | null>
    > = {
      year: monthRef,
      month: dateRef,
      day: dateRef,
    };
    const nextRef = refs[type];

    if (shouldMoveToNextField(type, value)) {
      if (type === "day") {
        nextRef.current?.blur();
      } else {
        nextRef.current?.focus();
      }
    }
  }, []);

  // 필드 포커스시 전체 선택
  const handleFieldFocus = useCallback(
    (e: React.FocusEvent<HTMLSpanElement>) => {
      const target = e.currentTarget;
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    },
    []
  );

  // 키 입력 전 처리 (전체 선택 상태에서 입력 시 기존 값 삭제)
  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      const sel = window.getSelection();
      if (!sel) return;

      const target = e.currentTarget;
      const selectedText = sel.toString();
      const fullText = target.textContent || "";

      // 전체 선택 상태인 경우 기존 내용 삭제하고 0000/00으로 초기화
      if (selectedText === fullText && fullText.length > 0) {
        const type = target.getAttribute("data-type") as
          | "year"
          | "month"
          | "day";
        const length = type === "year" ? 4 : 2;
        target.textContent = "0".repeat(length);
      }
    },
    []
  );

  return {
    yearRef,
    monthRef,
    dateRef,
    moveToNextField,
    handleFieldFocus,
    handleBeforeInput,
  };
}
