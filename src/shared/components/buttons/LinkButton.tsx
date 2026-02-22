import React from "react";
import Link from "next/link";

import { cn } from "@/shared/lib";

import { LinkButtonProps } from "./type";

function LinkButton({ children, className, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "w-full h-[48px] text-[16px] rounded-[4px] cursor-pointer flex justify-center items-center flex-row",
        "bg-red-500 disabled:bg-red-200 text-background disabled:cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default React.memo(LinkButton);
