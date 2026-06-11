"use client";

import { useEffect,useRef } from "react";

interface NumberStepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (value: number) => void;
  disabled?: boolean;
  canIncrement?: boolean;
  canDecrement?: boolean;
}

export function NumberStepper({
  label,
  value,
  min = 0,
  max = 100,
  onIncrement,
  onDecrement,
  onChange,
  disabled = false,
  canIncrement = true,
  canDecrement = true,
}: NumberStepperProps) {
  const valueRef = useRef<HTMLSpanElement>(null);

  // value prop이 변경되면 contentEditable 내용 업데이트
  useEffect(() => {
    if (valueRef.current && document.activeElement !== valueRef.current) {
      valueRef.current.textContent = String(value);
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const text = target.textContent || "";
    
    // 숫자만 허용 (빈 문자열도 임시로 허용)
    const numbersOnly = text.replace(/[^0-9]/g, "");
    
    if (text !== numbersOnly) {
      // 숫자가 아닌 문자가 입력되면 제거
      target.textContent = numbersOnly;
      // 커서를 끝으로 이동
      const range = document.createRange();
      const sel = window.getSelection();
      if (target.childNodes[0]) {
        range.setStart(target.childNodes[0], numbersOnly.length);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    const text = e.currentTarget.textContent || "";
    let numValue = parseInt(text, 10);

    // 빈 값이거나 NaN이면 최소값으로
    if (!text || isNaN(numValue)) {
      numValue = min;
    }

    // min/max 범위로 제한
    numValue = Math.max(min, Math.min(max, numValue));

    // 업데이트
    e.currentTarget.textContent = String(numValue);
    
    // 값이 변경되었으면 onChange 호출
    if (onChange && numValue !== value) {
      onChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    // Enter 키를 누르면 blur 처리
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
    
    // 위/아래 화살표 키로 증감
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (canIncrement) {
        onIncrement();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (canDecrement) {
        onDecrement();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    // 포커스 시 전체 선택
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(e.currentTarget);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-grey-500 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={disabled || !canDecrement}
          className="size-6 rounded-full border border-grey-300 flex items-center justify-center text-grey-700 hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-xl leading-none text-grey-600">−</span>
        </button>
        <span
          ref={valueRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="text-xl font-bold text-grey-900 min-w-[2rem] text-center outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
          role="textbox"
          aria-label={label}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={disabled || !canIncrement}
          className="size-6 rounded-full border border-grey-300 flex items-center justify-center text-grey-700 hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-xl leading-none text-grey-600">+</span>
        </button>
      </div>
    </div>
  );
}
