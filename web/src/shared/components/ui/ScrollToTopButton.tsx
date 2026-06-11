"use client";

import { ArrowUpIcon } from "@heroicons/react/24/outline";

import { FloatingButton } from "./FloatingButton";
import { useScrollHideComponent } from "../../hooks";

export function ScrollToTopButton() {
  const { componentRef, isVisible } = useScrollHideComponent();
  const handleScrollToTop = () => {
    document.body.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div
      ref={componentRef}
      className={`fixed bottom-3 flex justify-end left-0 right-2 md:right-6 p-2 z-30 pointer-events-none transition-transform duration-500 will-change-transform px-4 ${isVisible ? "translate-y-0" : "translate-y-[120%]"
        }`}
    >
      <FloatingButton
        innerElement={<ArrowUpIcon className="size-full text-primary" />}
        ariaLabel="맨 위로 이동"
        onClick={handleScrollToTop}
      />
    </div>
  );
}
