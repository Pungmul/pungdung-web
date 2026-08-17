"use client";

import { useId } from "react";

import { cn } from "@/shared/lib";

import { NumberStepperValueField } from "./NumberStepperValueField";

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
  errorMessage?: string;
}

const stepperButtonClassName = cn(
  "size-6 rounded-full border border-grey-300 flex items-center justify-center",
  "text-grey-700 hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
);

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
  errorMessage,
}: NumberStepperProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm text-grey-500 font-medium">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`${label} 줄이기`}
            onClick={onDecrement}
            disabled={disabled || !canDecrement}
            className={stepperButtonClassName}
          >
            <span aria-hidden className="text-xl leading-none text-grey-600">
              −
            </span>
          </button>
          <NumberStepperValueField
            id={inputId}
            value={value}
            min={min}
            max={max}
            disabled={disabled}
            canIncrement={canIncrement}
            canDecrement={canDecrement}
            isInvalid={hasError}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            {...(onChange ? { onChange } : {})}
            {...(hasError ? { describedBy: errorId } : {})}
          />
          <button
            type="button"
            aria-label={`${label} 늘리기`}
            onClick={onIncrement}
            disabled={disabled || !canIncrement}
            className={stepperButtonClassName}
          >
            <span aria-hidden className="text-xl leading-none text-grey-600">
              +
            </span>
          </button>
        </div>
      </div>
      {hasError ? (
        <p id={errorId} className="text-sm text-red-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
