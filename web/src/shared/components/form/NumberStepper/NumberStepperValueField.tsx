"use client";

import { useState } from "react";

import { cn } from "@/shared/lib";

type NumberStepperValueFieldProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  canIncrement: boolean;
  canDecrement: boolean;
  describedBy?: string;
  isInvalid: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (value: number) => void;
};

function resolveInteger(
  text: string,
  fallback: number,
  min: number,
  max: number
): number {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) {
    return fallback;
  }
  const parsedInteger = Number.parseInt(trimmed, 10);
  return Math.max(min, Math.min(max, parsedInteger));
}

export function NumberStepperValueField({
  id,
  value,
  min,
  max,
  disabled,
  canIncrement,
  canDecrement,
  describedBy,
  isInvalid,
  onIncrement,
  onDecrement,
  onChange,
}: NumberStepperValueFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commitDraft = (text: string) => {
    const nextValue = resolveInteger(text, value, min, max);
    setDraft(null);
    if (onChange && nextValue !== value) {
      onChange(nextValue);
    }
    return nextValue;
  };

  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      disabled={disabled}
      value={draft ?? String(value)}
      onFocus={() => {
        setDraft(String(value));
      }}
      onChange={(event) => {
        setDraft(event.target.value);
      }}
      onBlur={(event) => {
        commitDraft(event.currentTarget.value);
      }}
      onWheel={(event) => {
        event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          const nextValue = commitDraft(event.currentTarget.value);
          if (nextValue !== value) return;
          if (canIncrement) onIncrement();
          return;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          const nextValue = commitDraft(event.currentTarget.value);
          if (nextValue !== value) return;
          if (canDecrement) onDecrement();
        }
      }}
      className={cn(
        "text-xl font-bold text-grey-900 min-w-[2rem] w-12 text-center bg-transparent",
        "outline-none focus:ring-2 focus:ring-primary/20 rounded px-1",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        disabled && "cursor-not-allowed opacity-50"
      )}
      {...(describedBy ? { "aria-describedby": describedBy } : {})}
      {...(isInvalid ? { "aria-invalid": true } : {})}
    />
  );
}
