import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface AMPMFieldProps {
  type: "ampm";
  value: string;
  tabIndex?: number;
  onInput: (type: "ampm", inputText: string) => string;
  onFocus: (e: React.FocusEvent<HTMLSpanElement>) => void;
  onBeforeInput: (e: React.FormEvent<HTMLSpanElement>) => void;
  placeholder?: string;
  className?: string;
}

export interface AMPMFieldRef {
  focus: () => void;
}

export const AMPMField = forwardRef<AMPMFieldRef, AMPMFieldProps>(
  ({ value, tabIndex, onInput, onFocus, onBeforeInput, placeholder, className }, ref) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        spanRef.current?.focus();
      },
    }));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      // A나 P 키 입력 시 오전/오후 토글
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        onInput("ampm", "오전");
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        onInput("ampm", "오후");
      }
    };

    const handleClick = () => {
      // 클릭 시 오전/오후 토글
      const currentValue = value || "오전";
      const newValue = currentValue === "오전" ? "오후" : "오전";
      onInput("ampm", newValue);
    };

    return (
      <span
        ref={spanRef}
        contentEditable
        suppressContentEditableWarning
        tabIndex={tabIndex}
        onFocus={onFocus}
        onBeforeInput={onBeforeInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={className}
        data-placeholder={placeholder}
        style={{
          minWidth: "32px",
          display: "inline-block",
        }}
      >
        {value || placeholder}
      </span>
    );
  }
);

AMPMField.displayName = "AMPMField";