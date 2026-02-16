import React from "react";

import { cn } from "@/shared/lib";

interface ChipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  filled?: boolean;
}

function ChipButton({
  children,
  className,
  filled = false,
  ...props
}: ChipButtonProps) {
  return (
    <button
      type="button"
      className={
        cn(
          "px-3 py-1.5 rounded-full text-[14px] border-[2px] leading-[16px] text-center",
          filled ? "bg-grey-700 text-background border-grey-700" : "bg-background text-grey-500 border-grey-300",
          className,
        )}
      {...props}
    >
      {children}
    </button>
  );
}

export default React.memo(ChipButton);
