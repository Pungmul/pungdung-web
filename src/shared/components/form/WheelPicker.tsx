"use client";

import { useEffect,useMemo, useRef } from "react";

interface WheelPickerProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  containerHeight?: number;
  itemHeight?: number;
  loop?: boolean;
}

export function WheelPicker({
  options,
  value,
  onChange,
  className = "",
  containerHeight = 210,
  itemHeight = 40,
  loop = false,
}: WheelPickerProps) {
  const itemsContRef = useRef<HTMLUListElement>(null);
  const isScrolling = useRef<NodeJS.Timeout | null>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  const optionsMap = useMemo(
    () =>
      options.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map()
      ),
    [options]
  );
  const currentValue = useRef(optionsMap.get(value) ?? 0);

  // 루프를 위한 확장된 옵션 배열 생성
  const extendedOptions = useMemo(() => {
    if (!loop || options.length === 0) return options;
    
    // 앞뒤로 각각 3개씩 복사하여 무한 스크롤 효과
    const repeatCount = 3;
    const repeated = Array(repeatCount).fill(options).flat();
    return [...repeated, ...options, ...repeated];
  }, [options, loop]);

  // 실제 옵션 인덱스로 변환하는 함수
  const getRealIndex = (virtualIndex: number) => {
    if (!loop) return virtualIndex;
    const repeatCount = 3;
    return ((virtualIndex - repeatCount * options.length) % options.length + options.length) % options.length;
  };

  // 갭을 고려한 스크롤 위치 계산
  const getScrollPosition = (index: number) => {
    const gapSize = 4; // gap-[4px]
    const totalItemHeight = itemHeight + gapSize;
    
    if (loop) {
      // 루프 모드에서는 중앙 위치로 스크롤
      const repeatCount = 3;
      const centerIndex = repeatCount * options.length + index;
      return centerIndex * totalItemHeight;
    }
    
    const maxScrollTop = Math.max(0, (extendedOptions.length - 1) * totalItemHeight);
    const targetScrollTop = index * totalItemHeight;
    // 마지막 아이템의 경우 컨테이너 높이를 고려
    return Math.min(targetScrollTop, maxScrollTop);
  };

  useEffect(() => {
    const index = optionsMap.get(value);
    if (index !== undefined && index !== currentValue.current) {
      currentValue.current = index;
      // 애니메이션 없이 즉시 스크롤
      if (itemsContRef.current) {
        const originalScrollBehavior = itemsContRef.current.style.scrollBehavior;
        itemsContRef.current.style.scrollBehavior = 'auto';
        itemsContRef.current.scrollTop = getScrollPosition(index);
        // 원래 scrollBehavior 복원
        setTimeout(() => {
          if (itemsContRef.current) {
            itemsContRef.current.style.scrollBehavior = originalScrollBehavior;
          }
        }, 0);
      }
    }
  }, [value, optionsMap, itemHeight]);

  useEffect(() => {
    let isAnimating = false;
    let scrollTimeout: NodeJS.Timeout | null = null;

    function handleScroll(event: Event) {
      if (!isAnimating) {
        isAnimating = true;

        requestAnimationFrame(() => {
          const target = event.target as HTMLUListElement;
          const scrollTop = Math.max(target.scrollTop, 0);
          const gapSize = 4; // gap-[4px]
          const totalItemHeight = itemHeight + gapSize;
          
          // 현재 스크롤 위치에서 가장 가까운 아이템 인덱스 계산
          let selectedElement = Math.min(
            Math.max(Math.round(scrollTop / totalItemHeight), 0),
            extendedOptions.length - 1
          );
          
          // 루프 모드에서 실제 인덱스로 변환
          if (loop) {
            selectedElement = getRealIndex(selectedElement);
          }

          if (isScrolling.current) {
            clearTimeout(isScrolling.current);
          }

          currentValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            if (options && options[selectedElement]) {
              onChange(options[selectedElement]!.value);
            }
          }, 150);

          // 스크롤이 끝났을 때만 정확한 위치로 스냅
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          
          scrollTimeout = setTimeout(() => {
            if (loop) {
              // 루프 모드에서는 현재 위치가 중앙 영역이 아닐 때만 스냅
              const repeatCount = 3;
              const centerIndex = repeatCount * options.length + selectedElement;
              const targetScrollTop = centerIndex * totalItemHeight;
              const currentScrollTop = itemsContRef.current?.scrollTop || 0;
              
              // 현재 위치와 목표 위치의 차이가 크면 (다른 반복 영역에 있으면) 즉시 이동
              const scrollDiff = Math.abs(currentScrollTop - targetScrollTop);
              const threshold = options.length * totalItemHeight; // 한 반복 세트의 높이
              
              if (scrollDiff > threshold) {
                // 다른 반복 영역에 있으면 애니메이션 없이 즉시 이동
                if (itemsContRef.current) {
                  itemsContRef.current.scrollTop = targetScrollTop;
                }
              } else if (scrollDiff > 1) {
                // 같은 반복 영역 내에서만 부드러운 애니메이션
                if (itemsContRef.current) {
                  itemsContRef.current.scrollTo({
                    top: targetScrollTop,
                    behavior: 'instant'
                  });
                }
              }
            } else {
              const targetScrollTop = selectedElement * totalItemHeight;
              if (itemsContRef.current && Math.abs(itemsContRef.current.scrollTop - targetScrollTop) > 1) {
                itemsContRef.current.scrollTo({
                  top: targetScrollTop,
                  behavior: 'smooth'
                });
              }
            }
          }, 100);

          isAnimating = false;
        });
      }
    }

    itemsContRef.current?.addEventListener("scroll", handleScroll);

    // 초기 스크롤 위치 설정 (애니메이션 없이 즉시 설정)
    const initialIndex = optionsMap.get(value) ?? 0;
    if (itemsContRef.current) {
      // scrollBehavior를 임시로 auto로 변경하여 애니메이션 방지
      const originalScrollBehavior = itemsContRef.current.style.scrollBehavior;
      itemsContRef.current.style.scrollBehavior = 'auto';
      itemsContRef.current.scrollTop = getScrollPosition(initialIndex);
      // 원래 scrollBehavior 복원
      setTimeout(() => {
        if (itemsContRef.current) {
          itemsContRef.current.style.scrollBehavior = originalScrollBehavior;
        }
      }, 0);
    }

    return () => {
      itemsContRef.current?.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [options, itemHeight, onChange, optionsMap, value]);

  return (
    <div
      className={`flex w-[70px] h-full relative ${className}`}
      style={{
        height: `${containerHeight}px`,
      }}
    >
      {/* 선택된 항목 강조 배경 (맨 위) */}
      <ul
        className="flex-1 flex flex-col gap-[4px] h-full overflow-y-scroll w-full scrollbar-hide overflow-x-hidden"
        ref={itemsContRef}
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {extendedOptions.map((item, index) => (
          <li
            className="list-none flex flex-col items-center justify-center text-center w-[60px] box-border cursor-pointer"
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`,
              scrollSnapAlign: 'start'
            }}
            key={item.value+index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            onClick={() => {
              if (loop) {
                const realIndex = getRealIndex(index);
                if (options[realIndex]) {
                  onChange(options[realIndex].value);
                }
              } else {
                onChange(item.value);
              }
            }}
          >
            <div className="font-normal text-grey-700 md:text-[16px] text-[14px]">{item.label}</div>
          </li>
        ))}
        {/* 마지막 아이템이 선택될 수 있도록 여백 추가 */}
        <li className="list-none w-full">
          <div
            className="w-full h-full"
            style={{
              height: `${containerHeight - itemHeight - 4}px`, // gap 4px 고려
              pointerEvents: "none",
            }}
          />
        </li>
      </ul>
    </div>
  );
}
