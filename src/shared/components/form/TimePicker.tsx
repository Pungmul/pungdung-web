"use client";

import { useCallback, useMemo, useState } from "react";

import dayjs from "dayjs";

import { formatIntervalValue } from "./TimeInput/formatIntervalValue";
import { WheelPicker } from "./WheelPicker";

interface TimePickerProps {
  /** 현재 선택된 시간 (HH:mm:ss) */
  value?: string;
  /** 시간 선택 시 호출되는 함수 */
  onChange: (time: string) => void;
  /** 초 단위 표시 여부 */
  showSeconds?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;

  /** 오전 오후 출력 여부 */
  showAmPm?: boolean;

  /** 분 간격 옵션 */
  minuteInterval?: 1 | 5 | 15 | 30;

  /** 초 간격 옵션 */
  secondInterval?: 1 | 5 | 15 | 30;
}

export function TimePicker({
  value,
  onChange,
  showSeconds = false,
  className = "",
  showAmPm = false,
  minuteInterval = 5,
  secondInterval = 5,
}: TimePickerProps) {
  const [innerValue, setInnerValue] = useState(
    formatIntervalValue(
      value?.trim()
        ? value
        : dayjs().format(showSeconds ? "HH:mm:ss" : "HH:mm"),
      minuteInterval,
      secondInterval
    )
  );
  const [AmPmValue, setAmPmValue] = useState(() => {
    if (showAmPm) {
      const time = parseTimeString(
        value ?? dayjs().format(showSeconds ? "HH:mm:ss" : "HH:mm"),
        showSeconds
      );
      const hour24 = parseInt(time.hour);
      return hour24 < 12 ? "AM" : "PM";
    }
    return "AM";
  });

  const handleTimeChange = useCallback((newTime: string) => {
    setInnerValue(newTime);
  }, []);

  const handleAmPmChange = useCallback(
    (newAmPm: string) => {
      setAmPmValue(newAmPm);

      if (showAmPm) {
        // 오전/오후 변경 시 시간 재계산
        const newTime = parseTimeString(innerValue, showSeconds);
        const hour24 = parseInt(newTime.hour);
        let newHour24 = hour24;

        if (newAmPm === "AM") {
          // 오전으로 변경
          if (hour24 >= 12) {
            newHour24 = hour24 - 12;
          }
        } else {
          // 오후로 변경
          if (hour24 < 12) {
            newHour24 = hour24 + 12;
          }
        }

        newTime.hour = newHour24.toString().padStart(2, "0");
        const formattedTime = formatTimeString(newTime, showSeconds);
        handleTimeChange(formattedTime);
      }
    },
    [showAmPm, innerValue, showSeconds, handleTimeChange]
  );

  const currentTime = useMemo(() => {
    const time = parseTimeString(innerValue, showSeconds);

    if (showAmPm) {
      // 24시간을 12시간으로 변환
      const hour24 = parseInt(time.hour);
      let hour12 = hour24;

      if (hour24 === 0) {
        hour12 = 12; // 00시 -> 12시 (오전)
      } else if (hour24 > 12) {
        hour12 = hour24 - 12; // 13시 -> 1시 (오후)
      }

      return {
        ...time,
        hour: hour12.toString().padStart(2, "0"),
        second: showSeconds ? time.second : undefined,
      };
    }

    return {
      ...time,
      second: showSeconds ? time.second : undefined,
    };
  }, [innerValue, showSeconds, value, showAmPm]);

  const handleHourChange = useCallback(
    (hour: string) => {
      const newTime = parseTimeString(innerValue, showSeconds);

      if (showAmPm) {
        // 오전/오후 모드에서 24시간으로 변환
        let hour24 = parseInt(hour);
        if (AmPmValue === "AM") {
          // 오전: 12시는 00시로, 나머지는 그대로
          hour24 = hour24 === 12 ? 0 : hour24;
        } else {
          // 오후: 12시는 그대로, 나머지는 +12
          hour24 = hour24 === 12 ? 12 : hour24 + 12;
        }
        newTime.hour = hour24.toString().padStart(2, "0");
      } else {
        // 24시간 모드
        newTime.hour = hour;
      }

      const formattedTime = formatTimeString(newTime, showSeconds);
      handleTimeChange(formattedTime);
    },
    [innerValue, showSeconds, handleTimeChange, showAmPm, AmPmValue]
  );

  const handleMinuteChange = useCallback(
    (minute: string) => {
      const newTime = parseTimeString(innerValue, showSeconds);
      newTime.minute = minute;
      const formattedTime = formatTimeString(newTime, showSeconds);
      handleTimeChange(formattedTime);
    },
    [innerValue, showSeconds, handleTimeChange]
  );

  const handleSecondChange = useCallback(
    (second: string) => {
      if (!showSeconds) return;
      const newTime = parseTimeString(innerValue, showSeconds);
      newTime.second = second;
      const formattedTime = formatTimeString(newTime, showSeconds);
      handleTimeChange(formattedTime);
    },
    [innerValue, showSeconds, handleTimeChange]
  );

  const amPmOptions = useMemo(() => {
    return [
      {
        value: "AM",
        label: "오전",
      },
      {
        value: "PM",
        label: "오후",
      },
    ];
  }, []);

  const hourOptions = useMemo(() => {
    if (showAmPm) {
      // 오전/오후 모드: 1-12시
      return Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        return {
          value: hour.toString().padStart(2, "0"),
          label: hour.toString().padStart(2, "0"),
        };
      });
    } else {
      // 24시간 모드: 0-23시
      return Array.from({ length: 24 }, (_, i) => ({
        value: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0"),
      }));
    }
  }, [showAmPm]);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 / minuteInterval }, (_, i) => {
      const value = (i * minuteInterval).toString().padStart(2, "0");
      return {
        value,
        label: value,
      };
    });
  }, [minuteInterval]);

  const secondOptions = useMemo(() => {
    if (!showSeconds) return [];
    return Array.from({ length: 60 / secondInterval }, (_, i) => {
      const value = (i * secondInterval).toString().padStart(2, "0");
      return {
        value,
        label: value,
      };
    });
  }, [showSeconds, secondInterval]);

  const handleCurrentTime = useCallback(() => {
    const now = dayjs();

    if (showSeconds) {
      const formattedSecond = formatIntervalValue(
        now.format("HH:mm:ss"),
        minuteInterval,
        secondInterval
      );
      handleTimeChange(formattedSecond);
      return;
    }

    const formattedMinute = formatIntervalValue(
      now.format("HH:mm"),
      minuteInterval
    );
    handleTimeChange(formattedMinute);
  }, [showSeconds, minuteInterval, secondInterval, handleTimeChange]);

  const handleApply = useCallback(() => {
    onChange(innerValue);
  }, [onChange, innerValue]);

  return (
    <div className={`bg-background rounded-lg shadow-lg  ${className}`}>
      <div className="relative flex items-center justify-center space-x-2 p-[8px]">
        {/* Hour Wheel */}
        <div className="absolute w-full h-full p-[8px] top-0 left-0 right-0 bottom-0 ">
          <div className="w-full h-[40px] bg-primary opacity-[0.08] z-10 rounded-[8px]" />
        </div>

        {showAmPm && (
          <div className="flex flex-col items-center">
            {/* <div className="text-xs text-grey-500 mb-2">시</div> */}
            <WheelPicker
              options={amPmOptions}
              value={AmPmValue}
              onChange={handleAmPmChange}
              containerHeight={210}
              itemHeight={40}
            />
          </div>
        )}

        <div className="flex flex-col items-center">
          {/* <div className="text-xs text-grey-500 mb-2">시</div> */}
          <WheelPicker
            options={hourOptions}
            value={currentTime.hour}
            onChange={handleHourChange}
            containerHeight={210}
            itemHeight={40}
          />
        </div>

        {/* Minute Wheel */}
        <div className="flex flex-col items-center">
          {/* <div className="text-xs text-grey-500 mb-2">분</div> */}
          <WheelPicker
            options={minuteOptions}
            value={currentTime.minute}
            onChange={handleMinuteChange}
            containerHeight={210}
            itemHeight={40}
          />
        </div>

        {/* Second Wheel (conditional) */}
        {showSeconds && (
          <div className="flex flex-col items-center">
            {/* <div className="text-xs text-grey-500 mb-2">초</div> */}
            <WheelPicker
              options={secondOptions}
              value={currentTime.second || "00"}
              onChange={handleSecondChange}
              containerHeight={210}
              itemHeight={32}
            />
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between px-[12px] py-[8px] border-t border-grey-200">
        <button
          onClick={handleCurrentTime}
          type="button"
          className="px-4 py-2 text-sm text-grey-600 rounded-md hover:bg-grey-100 transition-colors"
        >
          현재
        </button>
        <button
          onClick={handleApply}
          type="button"
          className="px-4 py-2 text-sm text-background bg-primary rounded-md hover:bg-primary-light transition-colors"
        >
          적용
        </button>
      </div>
    </div>
  );
}

function parseTimeString(innerValue: string, showSeconds: boolean) {
  console.log("innerValue", innerValue);
  const parts = innerValue.split(":");
  return {
    hour: parts[0]?.padStart(2, "0") || "00",
    minute: parts[1]?.padStart(2, "0") || "00",
    second: showSeconds ? parts[2]?.padStart(2, "0") || "00" : undefined,
  };
}

function formatTimeString(
  time: { hour: string; minute: string; second?: string | undefined },
  showSeconds: boolean
) {
  if (showSeconds && time.second !== undefined) {
    return `${time.hour}:${time.minute}:${time.second}`;
  }
  return `${time.hour}:${time.minute}`;
}
