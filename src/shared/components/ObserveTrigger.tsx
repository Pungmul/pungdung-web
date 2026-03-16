import type { RefObject } from "react";
import { useEffect, useRef } from "react";

interface ObserveTriggerProps {
  trigger: () => void;
  unmountCondition?: boolean;
  triggerCondition?: IntersectionObserverInit;
  rootRef?: RefObject<Element | null>;
}

export default function ObserveTrigger({
  trigger,
  unmountCondition = false,
  triggerCondition,
  rootRef,
}: ObserveTriggerProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef?.current ?? triggerCondition?.root ?? null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          trigger();
        }
      },
      { ...triggerCondition, root }
    );

    const loader = loaderRef.current;
    if (loader && !unmountCondition) {
      observer.observe(loader);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootRef, trigger, triggerCondition, unmountCondition]);

  return <div ref={loaderRef} className="h-[0.5px] w-full" />;
}
