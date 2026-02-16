import { useEffect,useRef } from "react";

interface ObserveTriggerProps {
  trigger: () => void;
  unmountCondition: boolean;
  triggerCondition: IntersectionObserverInit;
}

export default function ObserveTrigger({ trigger, unmountCondition, triggerCondition }: ObserveTriggerProps) {
  const loaderRef = useRef<HTMLDivElement>(null); // 무한 스크롤을 감지할 마지막 요소

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          trigger(); // 마지막 항목이 보이면 데이터 로드
        }
      },
      triggerCondition
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current); // 마지막 항목에 옵저버 적용
    }

    if (loaderRef.current && unmountCondition) {
      observer.unobserve(loaderRef.current);
    }

    // Cleanup (컴포넌트가 언마운트 될 때 옵저버 해제)
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [unmountCondition, trigger, triggerCondition]);

  return <div ref={loaderRef} className="h-[0.5px] w-full" />;
}
