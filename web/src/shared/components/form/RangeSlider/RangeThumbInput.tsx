import { cn } from "@/shared/lib";

type RangeThumbInputProps = {
  accessibleName: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  describedBy?: string;
  isInvalid: boolean;
  className?: string;
  onChange: (value: number) => void;
  onFocus: () => void;
};

export function RangeThumbInput({
  accessibleName,
  value,
  min,
  max,
  step,
  disabled,
  describedBy,
  isInvalid,
  className,
  onChange,
  onFocus,
}: RangeThumbInputProps) {
  return (
    <input
      type="range"
      aria-label={accessibleName}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        onChange(Number(event.target.value));
      }}
      onFocus={onFocus}
      {...(describedBy ? { "aria-describedby": describedBy } : {})}
      {...(isInvalid ? { "aria-invalid": true } : {})}
      className={cn(
        // 두 range를 겹침
        // 트랙은 클릭을 받지 않고 썸만 받음
        "absolute inset-y-0 left-0 m-0 h-6 w-full appearance-none border-0 bg-transparent outline-none",
        "pointer-events-none disabled:cursor-not-allowed",
        "[&::-webkit-slider-runnable-track]:pointer-events-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent",
        "[&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto",
        "[&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:rounded-full",
        "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md",
        "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
        "focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-primary",
        "[&::-moz-range-track]:h-2 [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-transparent",
        "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-md",
        className
      )}
    />
  );
}
