import { useCallback } from "react";

import { FieldType } from "@/shared/types";

interface NumericFieldProps<T extends FieldType> {
  type: T;
  value: string;
  tabIndex: number;
  onInput: (type: T, inputText: string) => string;
  onFocus: (e: React.FocusEvent<HTMLSpanElement>) => void;
  onBeforeInput: (e: React.FormEvent<HTMLSpanElement>) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  accessibleName?: string;
  describedBy?: string;
  isInvalid?: boolean;
  ref?: React.RefObject<HTMLSpanElement | null>;
}

const getAccessibleName = <T extends FieldType>(type: T): string => {
  const names = {
    year: "연도",
    month: "월",
    day: "일",
    hour: "시",
    minute: "분",
    second: "초",
  };
  return names[type];
};

export const NumericField = <T extends FieldType>({
  type,
  value,
  tabIndex,
  onInput,
  onFocus,
  onBeforeInput,
  className,
  disabled,
  placeholder,
  accessibleName,
  describedBy,
  isInvalid,
  ref,
}: NumericFieldProps<T> & { ref?: React.RefObject<HTMLSpanElement | null> }) => {
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      if (disabled) return;

      const target = e.currentTarget;
      const inputText = target.textContent?.replace(/^0+(?=\d)/, "") || "";

      const formattedValue = onInput(type, inputText);
      target.textContent = formattedValue;

      // 커서를 마지막 위치에 설정 (setTimeout으로 DOM 업데이트 후 실행)
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
    },
    [type, onInput, disabled]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLSpanElement>) => {
      if (disabled) return;
      onFocus(e);
    },
    [onFocus, disabled]
  );

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      if (disabled) return;
      onBeforeInput(e);
    },
    [onBeforeInput, disabled]
  );

  return (
    <span
      ref={ref}
      data-type={type}
      role="textbox"
      aria-multiline="false"
      aria-label={accessibleName ?? getAccessibleName(type)}
      aria-disabled={disabled || undefined}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      contentEditable={!disabled}
      tabIndex={disabled ? -1 : tabIndex}
      suppressContentEditableWarning={true}
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      onFocus={handleFocus}
      inputMode="numeric"
      className={`${className} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
        }`}
      data-placeholder={placeholder}
    >
      {value || placeholder}
    </span>
  );
};

NumericField.displayName = "NumericField";

// DateField는 NumericField의 별칭으로 유지 (하위 호환성)
export const DateField = NumericField;
