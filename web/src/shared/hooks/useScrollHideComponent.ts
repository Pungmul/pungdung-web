"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_HIDE_THRESHOLD = 60;
const DEFAULT_SHOW_THRESHOLD = 10;

interface UseScrollHideComponentOptions {
  scrollTargetElement?: HTMLElement | null;
  scrollContainerSelector?: string;
  hideThreshold?: number;
  showThreshold?: number;
}

interface UseScrollHideComponentReturn {
  componentRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export function useScrollHideComponent({
  scrollTargetElement,
  scrollContainerSelector = ".mobile-scroll-container",
  hideThreshold = DEFAULT_HIDE_THRESHOLD,
  showThreshold = DEFAULT_SHOW_THRESHOLD,
}: UseScrollHideComponentOptions = {}): UseScrollHideComponentReturn {
  const [isVisible, setIsVisible] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);

  useEffect(() => {
    const selectorTarget = document.querySelector(scrollContainerSelector);
    const elementTarget =
      scrollTargetElement ?? (selectorTarget as HTMLElement | null);
    const isCustomElementScroll = !!elementTarget;

    const getScrollTop = () =>
      isCustomElementScroll
        ? (elementTarget as HTMLElement).scrollTop
        : Math.max(
            window.scrollY || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0
          );
    const handleScroll = () => {
      const currentScrollY = getScrollTop();
      const diff = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const componentHeight = componentRef.current?.offsetHeight ?? 0;
      if (currentScrollY < componentHeight) {
        setIsVisible(true);
        scrollDelta.current = 0;
        return;
      }

      if (diff > 0) {
        scrollDelta.current = Math.max(0, scrollDelta.current) + diff;
        if (scrollDelta.current > hideThreshold) {
          setIsVisible(false);
          scrollDelta.current = 0;
        }
        return;
      }

      scrollDelta.current = Math.min(0, scrollDelta.current) + diff;
      if (scrollDelta.current < -showThreshold) {
        setIsVisible(true);
        scrollDelta.current = 0;
      }
    };

    const handleTouch = () => {
      setIsVisible(true);
      scrollDelta.current = 0;
    };

    lastScrollY.current = getScrollTop();

    const eventTargets: EventTarget[] = isCustomElementScroll
      ? [elementTarget as HTMLElement]
      : [window, document, document.documentElement, document.body];

    eventTargets.forEach((target) => {
      target.addEventListener("scroll", handleScroll, { passive: true });
      target.addEventListener("touchstart", handleTouch, { passive: true });
    });

    return () => {
      eventTargets.forEach((target) => {
        target.removeEventListener("scroll", handleScroll);
        target.removeEventListener("touchstart", handleTouch);
      });
    };
  }, [
    scrollTargetElement,
    scrollContainerSelector,
    hideThreshold,
    showThreshold,
  ]);

  return { componentRef, isVisible };
}
