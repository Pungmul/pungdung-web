import React from "react";

import { default as LinkButton } from "./LinkButton";
import { LinkButtonProps } from "./type";

function BottomFixedLinkButton({
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <div className="w-full sticky bottom-0 left-0 right-0 px-[24px] pb-[32px] pt-[24px] bg-gradient-to-t from-background to-80% to-transparent">
      <LinkButton {...props} className={className ?? ""}>
        {children}
      </LinkButton>
    </div>
  );
}

export default React.memo(BottomFixedLinkButton);
