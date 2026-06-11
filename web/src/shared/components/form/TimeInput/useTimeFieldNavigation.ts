import { useCallback,useRef } from "react";

export interface UseTimeFieldNavigationProps {
  showSeconds?: boolean;
  showAmPm?: boolean;
}

export function useTimeFieldNavigation({
  showSeconds = false,
  showAmPm = false,
}: UseTimeFieldNavigationProps) {
  const hourRef = useRef<HTMLSpanElement | null>(null);
  const minuteRef = useRef<HTMLSpanElement | null>(null);
  const secondRef = useRef<HTMLSpanElement | null>(null);
  const ampmRef = useRef<HTMLSpanElement | null>(null);

  const moveToNextField = useCallback(
    (currentField: "hour" | "minute" | "second" | "ampm") => {
      switch (currentField) {

        case "ampm":
          if(showAmPm && currentField === "ampm") {
            hourRef.current?.focus();
          }
          break;
        case "hour":
          if(currentField === "hour" && Number(hourRef.current?.textContent) >= 10) {
            minuteRef.current?.focus();
          }
          break;
        case "minute":
          if (showSeconds) {
            if(currentField === "minute" && Number(minuteRef.current?.textContent) >= 10) {
              secondRef.current?.focus();
            }
          }
          break;
        case "second":
          // No next field after second
          break;
      }
    },
    [showSeconds, showAmPm]
  );

  const handleFieldFocus = useCallback(
    (e: React.FocusEvent<HTMLSpanElement>) => {
      // 필드 포커스 시 전체 선택
      const target = e.currentTarget;
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    },
    []
  );

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      // 키 입력 전 처리 (전체 선택 상태에서 입력 시 기존 값 삭제)
      const sel = window.getSelection();
      if (!sel) return;

      const target = e.currentTarget;
      const selectedText = sel.toString();
      const fullText = target.textContent || "";

      // 전체 선택 상태인 경우 기존 내용 삭제하고 00으로 초기화
      if (selectedText === fullText && fullText.length > 0) {
        target.textContent = "00";
        
        // 커서를 마지막 위치에 설정
        setTimeout(() => {
          const range = document.createRange();
          range.selectNodeContents(target);
          range.collapse(false); // false = 끝으로 커서 이동
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
      }
    },
    []
  );

  return {
    hourRef,
    minuteRef,
    secondRef,
    ampmRef,
    moveToNextField,
    handleFieldFocus,
    handleBeforeInput,
  };
}
