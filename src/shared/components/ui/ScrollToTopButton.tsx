"use client";

import { ArrowUpIcon } from "@heroicons/react/24/outline";

import { useScrollHideComponent } from "../../hooks";

export function ScrollToTopButton() {
  const { componentRef, isVisible } = useScrollHideComponent();
  const handleScrollToTop = () => {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={componentRef}
      className={`fixed bottom-3 flex justify-end left-0 right-2 md:right-6 p-2 z-30 pointer-events-none transition-transform duration-500 will-change-transform px-4 ${isVisible ? "translate-y-0" : "translate-y-[120%]"
        }`}
    >
      <button
        type="button"
        aria-label="맨 위로 이동"
        className="pointer-events-auto size-9 p-2 bg-background rounded-full flex items-center justify-center border border-1 border-grey-300 shadow-md"
        onClick={handleScrollToTop}
      >
        <ArrowUpIcon className="text-primary" />
      </button>
    </div>
  );
}
