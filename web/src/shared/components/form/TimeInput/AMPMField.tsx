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
  describedBy?: string;
  isInvalid?: boolean;
  disabled?: boolean;
}

export interface AMPMFieldRef {
  focus: () => void;
}

export const AMPMField = forwardRef<AMPMFieldRef, AMPMFieldProps>(
  ({ value, tabIndex, onInput, onFocus, onBeforeInput, placeholder, className, describedBy, isInvalid, disabled }, ref) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        spanRef.current?.focus();
      },
    }));

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        onInput("ampm", "오전");
      } else if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        onInput("ampm", "오후");
      }
    };

    const handleClick = () => {
      if (disabled) return;
      const currentValue = value || "오전";
      const newValue = currentValue === "오전" ? "오후" : "오전";
      onInput("ampm", newValue);
    };

    return (
      <span
        ref={spanRef}
        role="textbox"
        aria-multiline="false"
        aria-label="오전 오후"
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        aria-disabled={disabled || undefined}
        contentEditable={!disabled}
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