import React from "react";

import { cn } from "@/shared/lib";

function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "w-full h-[48px] text-[16px] rounded-[4px] cursor-pointer flex justify-center items-center flex-row",
        "bg-red-500 disabled:bg-red-200 text-background disabled:cursor-default",
        className
      )}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);
