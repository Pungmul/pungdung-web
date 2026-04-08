import { forwardRef, memo } from "react";

import { cn } from "@/shared/lib";

import { IconProps } from "../../types/type";

const CHAT_BUBBLE_PATH =
  "M15.9951 2.75C23.0841 2.75 28.8726 8.32045 29.2246 15.3242L29.2373 15.6592V15.6748L29.2412 15.9844V24.4004L29.248 24.5068C29.2798 24.7684 29.4249 25.1196 29.7207 25.5391C30.0429 25.996 30.4519 26.4051 30.7637 26.6846C31.2795 27.147 31.3309 27.8082 31.1621 28.2783C30.9915 28.7534 30.5137 29.2499 29.79 29.25H15.9951C8.67958 29.2498 2.75 23.3172 2.75 16C2.75 8.68278 8.67958 2.75016 15.9951 2.75Z";

// 채팅 아이콘 중앙 점 원 반지름
const CHAT_DOT_RADIUS = 2.2;

const CHAT_DOT_CENTERS = [
  { cx: 9.6, cy: 16.5 },
  { cx: 16, cy: 16.5 },
  { cx: 22.4, cy: 16.5 },
] as const;

function circleExcludePath(cx: number, cy: number, radius: number) {
  const left = cx - radius;
  const right = cx + radius;

  return `M${left} ${cy}A${radius} ${radius} 0 1 0 ${right} ${cy}A${radius} ${radius} 0 1 0 ${left} ${cy}`;
}

const CHAT_DOT_PATH = CHAT_DOT_CENTERS.map(({ cx, cy }) =>
  circleExcludePath(cx, cy, CHAT_DOT_RADIUS)
).join(" ");

const CHAT_ICON_PATH = `${CHAT_BUBBLE_PATH} ${CHAT_DOT_PATH}`;

const ChatIconFilled = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChatIconFilled(
    { title, titleId, className, ...props },
    ref
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        aria-labelledby={titleId}
        className={cn("size-full", className)}
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={CHAT_ICON_PATH}
          fill="currentColor"
        />
      </svg>
    );
  })
);

export default ChatIconFilled;
