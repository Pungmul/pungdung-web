"use client";

import { useId, useState } from "react";

import { cn } from "@/shared/lib";

import { RangeThumbInput } from "./RangeThumbInput";

const inactiveMinimumZ = "z-[5]";
const inactiveMaximumZ = "z-[6]";
const activeThumbZ = "z-10";

function toRangePercent(value: number, min: number, rangeSize: number) {
  if (rangeSize === 0) {
    return 0;
  }

  const percent = ((value - min) / rangeSize) * 100;
  return Math.min(100, Math.max(0, percent));
}

interface RangeSliderProps {
  label?: string;
  minimumName: string;
  maximumName: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  onChange: (min: number, max: number) => void;
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export function RangeSlider({
  label,
  minimumName,
  maximumName,
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  onChange,
  className,
  disabled = false,
  errorMessage,
}: RangeSliderProps) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${generatedId}-error`;
  const [activeThumb, setActiveThumb] = useState<"minimum" | "maximum">(
    "maximum"
  );

  const rangeSize = max - min;
  const minimumPercent = toRangePercent(minValue, min, rangeSize);
  const maximumPercent =
    rangeSize === 0 ? 100 : toRangePercent(maxValue, min, rangeSize);
  const fillStart = Math.min(minimumPercent, maximumPercent);
  const fillEnd = Math.max(minimumPercent, maximumPercent);
  const hasLabel = Boolean(label);
  const hasError = Boolean(errorMessage);
  const describedBy = hasError ? errorId : undefined;
  const minimumUpperBound = Math.max(min, maxValue - step);
  const maximumLowerBound = Math.min(max, minValue + step);

  return (
    <div
      role="group"
      className={cn("w-full", className)}
      {...(hasLabel ? { "aria-labelledby": labelId } : {})}
      {...(describedBy ? { "aria-describedby": describedBy } : {})}
    >
      {hasLabel ? (
        <div id={labelId} className="text-grey-700 font-medium mb-3">
          {label}
        </div>
      ) : null}

      <div
        className={cn("relative h-6", disabled && "opacity-50")}
      >
        <div
          aria-hidden
          className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-grey-200"
        />
        <div
          aria-hidden
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `${fillStart}%`,
            width: `${fillEnd - fillStart}%`,
          }}
        />
        <RangeThumbInput
          accessibleName={minimumName}
          value={minValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          isInvalid={hasError}
          className={activeThumb === "minimum" ? activeThumbZ : inactiveMinimumZ}
          {...(describedBy ? { describedBy } : {})}
          onChange={(nextMinimum) => {
            onChange(Math.min(nextMinimum, minimumUpperBound), maxValue);
          }}
          onFocus={() => {
            setActiveThumb("minimum");
          }}
        />
        <RangeThumbInput
          accessibleName={maximumName}
          value={maxValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          isInvalid={hasError}
          className={activeThumb === "maximum" ? activeThumbZ : inactiveMaximumZ}
          {...(describedBy ? { describedBy } : {})}
          onChange={(nextMaximum) => {
            onChange(minValue, Math.max(nextMaximum, maximumLowerBound));
          }}
          onFocus={() => {
            setActiveThumb("maximum");
          }}
        />
      </div>

      {hasError ? (
        <p id={errorId} className="mt-4 text-sm text-red-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
