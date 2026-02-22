import { CSSProperties } from "react";

import { cn } from "@/shared/lib";

export const SkeletonView: React.FC<{
  className?: string;
  style?: CSSProperties;
}> = ({
  className,
  style,
}) => {

  return (
    <div
      style={{ ...style, backgroundColor: "var(--color-grey-300)" }}
      className={cn("skeleton-container ", className)}
    >
      <div
        className="skeleton-item"
      />
    </div>
  );
};
