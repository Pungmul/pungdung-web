"use client";

import { useEffect, useMemo,useState } from "react";
import { useRouter } from "next/navigation";

import { throttle } from "lodash";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useView } from "@/shared/lib/view/view-store-provider";

export function Header({
  title,
  rightBtn,
  onLeftClick,
  isBackBtn = true,
  className = "",
  bottomGradientOffsetPx = 0,
}: {
  title: string | React.ReactNode;
  rightBtn?: React.ReactNode;
  onLeftClick?: () => void;
  isBackBtn?: boolean;
  className?: string;
  bottomGradientOffsetPx?: number;
}) {
  const view = useView();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const getScrollTop = () =>
      Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

    const updateSticky = () => {
      setIsSticky(getScrollTop() > 0);
    };

    const handleScroll = throttle(
      updateSticky,
      100,
      { leading: true, trailing: true }
    );

    const eventTargets: EventTarget[] = [
      window,
      document,
      document.documentElement,
      document.body,
    ];

    updateSticky();
    eventTargets.forEach((target) => {
      target.addEventListener("scroll", handleScroll, { passive: true });
    });

    return () => {
      handleScroll.cancel();
      eventTargets.forEach((target) => {
        target.removeEventListener("scroll", handleScroll);
      });
    };
  }, []);

  const leftButton = useMemo(
    () => (
      <div
        className="absolute self-center flex items-center justify-center z-10 size-[32px] cursor-pointer left-[20px]"
        onClick={() => {
          if (onLeftClick) {
            onLeftClick();
          } else {
            if (view === "webview") {
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({ action: "pop" })
              );
            } else router.back();
          }
        }}
      >
        <XMarkIcon className="w-[28px] h-[28px]" />
      </div>
    ),
    [onLeftClick, view, router]
  );

  return (
    <nav
      className={`w-full bg-background flex h-[50px] flex-col z-10 justify-center items-center sticky shrink-0 top-0 ${className}`}
    >
      <div
        className={
          "absolute inset-x-0 w-full h-[24px] z-20 bg-gradient-to-b from-background to-80% to-transparent " +
          (isSticky ? "block" : "hidden")
        }
        style={{ top: `calc(100% + ${bottomGradientOffsetPx}px)` }}
      />
      {isBackBtn && leftButton}
      {typeof title === "string" ? (
        <div className="font-normal z-10 text-grey-800 text-[20px]">
          {title}
        </div>
      ) : (
        title
      )}
      {!!rightBtn && (
        <div className="absolute" style={{ right: 24 }}>
          {rightBtn}
        </div>
      )}
    </nav>
  );
}
