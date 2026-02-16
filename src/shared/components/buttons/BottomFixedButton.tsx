import React from "react";

import { default as Button } from "./Button";

export function BottomFixedButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className="w-full sticky bottom-0 left-0 right-0 px-[24px] pb-[32px] pt-[24px] bg-gradient-to-t from-background via-background via-80% to-transparent z-50">
      <Button className={className} {...props}>
        {children}
      </Button>
    </div>
  );
}

export default React.memo(BottomFixedButton);
