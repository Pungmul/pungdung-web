import React from "react";
import Link from "next/link";

import { cn } from "@/shared";

interface LinkChipButtonProps extends React.ComponentPropsWithoutRef<
  typeof Link
> {
  filled?: boolean;
}

function LinkChipButton({
  children,
  className = "",
  filled = false,
  ...props
}: LinkChipButtonProps) {
  return (
    <Link
      className={cn(
        "px-[12px] py-[8px] rounded-[20px] text-[14px] border-[2px] leading-[16px] text-center",
        filled
          ? "bg-grey-700 text-background border-grey-700"
          : "bg-background text-grey-500 border-grey-300",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default LinkChipButton;
