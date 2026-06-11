"use client";

import { useCallback, useEffect,useRef, useState } from "react";

interface RangeSliderProps {
  label?: string;
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
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  onChange,
  className = "",
  disabled = false,
  errorMessage,
}: RangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  const getPercentage = useCallback(
    (value: number) => {
      return ((value - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      );
      const value = min + (percentage / 100) * (max - min);
      return Math.round(value / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown = useCallback(
    (thumb: "min" | "max") => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      if (thumb === "min") {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }
    },
    [disabled]
  );

  const handleTouchStart = useCallback(
    (thumb: "min" | "max") => (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      if (thumb === "min") {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }
    },
    [disabled]
  );

  useEffect(() => {
    const handleMove = (clientX: number) => {
      const newValue = getValueFromPosition(clientX);

      if (isDraggingMin) {
        const clampedValue = Math.max(min, Math.min(newValue, maxValue - step));
        if (clampedValue !== minValue) {
          onChange(clampedValue, maxValue);
        }
      } else if (isDraggingMax) {
        const clampedValue = Math.min(max, Math.max(newValue, minValue + step));
        if (clampedValue !== maxValue) {
          onChange(minValue, clampedValue);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [
    isDraggingMin,
    isDraggingMax,
    getValueFromPosition,
    minValue,
    maxValue,
    min,
    max,
    step,
    onChange,
  ]);

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-grey-700 font-medium block mb-3">
          {label}
        </label>
      )}

      <div className="space-y-4">

        <div
          ref={sliderRef}
          className={`relative h-2 bg-grey-200 rounded-full ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full shadow-md ${
              disabled
                ? "cursor-not-allowed"
                : "cursor-grab active:cursor-grabbing hover:scale-110"
            } transition-transform ${isDraggingMin ? "scale-110 z-10" : "z-[5]"}`}
            style={{
              left: `calc(${minPercentage}% - 12px)`,
            }}
            onMouseDown={handleMouseDown("min")}
            onTouchStart={handleTouchStart("min")}
          />

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full shadow-md ${
              disabled
                ? "cursor-not-allowed"
                : "cursor-grab active:cursor-grabbing hover:scale-110"
            } transition-transform ${isDraggingMax ? "scale-110 z-10" : "z-[5]"}`}
            style={{
              left: `calc(${maxPercentage}% - 12px)`,
            }}
            onMouseDown={handleMouseDown("max")}
            onTouchStart={handleTouchStart("max")}
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
