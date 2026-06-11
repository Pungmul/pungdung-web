'use client';

import { memo } from "react";

import { useTimeGapPannelCountdown } from "../../../hooks/view-model";

/**
 * 남은 시간을 분:초 형식으로 표시하는 패널 컴포넌트
 * @param timeString - 목표 시간 문자열 (ISO 8601 형식)
 */
export const TimeGapPannel = memo(function TimeGapPannel({
  timeString,
}: {
  timeString: string;
}) {
  const { minContainerRef, minRef, secRef } = useTimeGapPannelCountdown(
    timeString
  );

  return (
    <div className="flex flex-row justify-center items-center gap-[8px]">
      <div ref={minContainerRef} className="flex flex-col items-center w-[64px]">
        <div
          ref={minRef}
          className="text-[28px] font-bold px-2 rounded"
        >
          {/* 초기값은 useTimeGapPannelCountdown에서 설정 */}
        </div>
        <div className="text-[16px]">분</div>
      </div>

      <div className="flex flex-col items-center w-[64px]">
        <div
          ref={secRef}
          className="text-[28px] font-bold px-2 rounded"
        >
          {/* 초기값은 useTimeGapPannelCountdown에서 설정 */}
        </div>
        <div className="text-[16px]">초</div>
      </div>
    </div>
  );
});
