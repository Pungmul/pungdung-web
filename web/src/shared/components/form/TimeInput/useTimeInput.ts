import { useCallback, useEffect,useMemo, useState } from "react";

export interface UseTimeInputProps {
  value?: string;
  onChange?: ((time: string) => void) | undefined;
  showSeconds?: boolean;
  showAmPm?: boolean;
  minTime?: string;
  maxTime?: string;
}

// 시간 유효성 검사 함수
const isValidTimeValue = (
  value: string,
  type: "hour" | "minute" | "second"
): boolean => {
  const num = parseInt(value, 10);
  if (isNaN(num)) return false;

  switch (type) {
    case "hour":
      return num >= 0 && num <= 23;
    case "minute":
    case "second":
      return num >= 0 && num <= 59;
    default:
      return false;
  }
};

const emptyTimeDisplay = (
  showSeconds: boolean,
  showAmPm: boolean
): {
  hour: string;
  minute: string;
  second?: string | undefined;
  ampm?: string | undefined;
} => {
  const t: {
    hour: string;
    minute: string;
    second?: string | undefined;
    ampm?: string | undefined;
  } = { hour: "HH", minute: "MM" };
  if (showSeconds) t.second = "SS";
  if (showAmPm) t.ampm = "";
  return t;
};

const hasPlaceholderToken = (
  t: {
    hour: string;
    minute: string;
    second?: string | undefined;
    ampm?: string | undefined;
  },
  showSeconds: boolean
) => t.hour === "HH" || t.minute === "MM" || (showSeconds && t.second === "SS");

const isAllPlaceholderTokens = (
  t: {
    hour: string;
    minute: string;
    second?: string | undefined;
  },
  showSeconds: boolean
) =>
  t.hour === "HH" && t.minute === "MM" && (!showSeconds || t.second === "SS");

// 시간 문자열을 파싱하는 함수 - AM/PM 지원 버전
const parseTimeString = (
  timeStr: string,
  showSeconds: boolean,
  showAmPm: boolean
) => {
  if (!timeStr?.trim()) {
    return emptyTimeDisplay(showSeconds, showAmPm);
  }

  const [hours, minutes, seconds] = timeStr.split(":");

  if (!hours || !minutes) {
    return emptyTimeDisplay(showSeconds, showAmPm);
  }

  if (showAmPm) {
    const ampm = Number(hours) >= 12 ? "오후" : "오전";
    let formattedHour =
      ampm === "오후" && Number(hours) !== 12
        ? Number(hours) - 12
        : Number(hours);

    if (ampm === "오전" && formattedHour === 0) {
      formattedHour = 12;
    }

    return {
      hour: formattedHour.toString().padStart(2, "0"),
      minute: minutes?.padStart(2, "0") || "00",
      second: showSeconds ? seconds?.padStart(2, "0") || "00" : undefined,
      ampm: ampm,
    };
  }

  return {
    hour: hours.padStart(2, "0"),
    minute: minutes.padStart(2, "0"),
    second: showSeconds ? seconds?.padStart(2, "0") || "00" : undefined,
  };
};

// 시간 객체를 문자열로 변환하는 함수 - ISO 형식 HH:mm
const formatTimeString = (
  time: {
    hour: string;
    minute: string;
    second?: string | undefined;
    ampm?: string | undefined;
  },
  showSeconds: boolean,
  showAmPm: boolean
): string => {
  let hour24 = parseInt(time.hour, 10);

  // 12시간 형식을 24시간 형식으로 변환
  if (showAmPm && time.ampm) {
    if (time.ampm === "오후" && hour24 !== 12) {
      hour24 += 12;
    } else if (time.ampm === "오전" && hour24 === 12) {
      hour24 = 0;
    }
  }

  const hour24Str = hour24.toString().padStart(2, "0");
  let timeStr = "";

  if (showSeconds && time.second !== undefined) {
    timeStr = `${hour24Str}:${time.minute}:${time.second}`;
  } else {
    timeStr = `${hour24Str}:${time.minute}`;
  }

  return timeStr;
};

export function useTimeInput({
  value,
  onChange,
  showSeconds = false,
  showAmPm = false,
  minTime = "",
  maxTime = "",
}: UseTimeInputProps) {
  const [typeTime, setTypeTime] = useState(() =>
    parseTimeString(value ?? "", showSeconds, showAmPm)
  );

  const displayTime = typeTime;

  const isValidTime = useMemo(() => {
    if (hasPlaceholderToken(displayTime, showSeconds)) return true;

    // AM/PM 모드에서는 시간 범위가 1-12
    const hourRange = showAmPm ? { min: 1, max: 12 } : { min: 0, max: 23 };
    const hourNum = parseInt(displayTime.hour, 10);
    const isValidHour =
      !isNaN(hourNum) && hourNum >= hourRange.min && hourNum <= hourRange.max;

    return (
      isValidHour &&
      isValidTimeValue(displayTime.minute, "minute") &&
      (showSeconds
        ? isValidTimeValue(displayTime.second || "00", "second")
        : true)
    );
  }, [displayTime, showSeconds, showAmPm]);

  useEffect(() => {
    setTypeTime(parseTimeString(value ?? "", showSeconds, showAmPm));
  }, [value, showSeconds, showAmPm]);

  const updateFieldValue = useCallback(
    (field: "hour" | "minute" | "second" | "ampm", newValue: string) => {
      const updatedTime = { ...displayTime, [field]: newValue };

      if (field !== "ampm") {
        updatedTime[field] = newValue.padStart(2, "0");
      }

      if (hasPlaceholderToken(updatedTime, showSeconds)) {
        setTypeTime(updatedTime);
        if (isAllPlaceholderTokens(updatedTime, showSeconds)) {
          onChange?.("");
        }
        return;
      }

      const newTimeString = formatTimeString(
        updatedTime,
        showSeconds,
        showAmPm
      );

      let newTime;

      if (minTime && newTimeString < minTime) {
        newTime = parseTimeString(minTime, showSeconds, showAmPm);
      } else if (maxTime && newTimeString > maxTime) {
        newTime = parseTimeString(maxTime, showSeconds, showAmPm);
      } else {
        newTime = parseTimeString(newTimeString, showSeconds, showAmPm);
      }

      setTypeTime(newTime);

      const hourRange = showAmPm ? { min: 1, max: 12 } : { min: 0, max: 23 };
      const hourNum = parseInt(updatedTime.hour, 10);
      const isValidHour =
        !isNaN(hourNum) && hourNum >= hourRange.min && hourNum <= hourRange.max;

      const isValid =
        isValidHour &&
        isValidTimeValue(updatedTime.minute, "minute") &&
        (showSeconds
          ? isValidTimeValue(updatedTime.second || "00", "second")
          : true);

      if (isValid) {
        onChange?.(newTimeString);
      }
    },
    [displayTime, onChange, showSeconds, showAmPm, minTime, maxTime]
  );

  const handleFieldInput = useCallback(
    (
      type: "hour" | "minute" | "second" | "ampm",
      inputText: string
    ): string => {
      if (type === "ampm") {
        const upperInput = inputText.toUpperCase();
        if (upperInput === "A" || upperInput === "오전") {
          updateFieldValue("ampm", "오전");
          return "오전";
        } else if (upperInput === "P" || upperInput === "오후") {
          updateFieldValue("ampm", "오후");
          return "오후";
        }
        const currentAmPm = displayTime.ampm || "오전";
        const newAmPm = currentAmPm === "오전" ? "오후" : "오전";
        updateFieldValue("ampm", newAmPm);
        return newAmPm;
      }

      if (!inputText) {
        const token = type === "hour" ? "HH" : type === "minute" ? "MM" : "SS";
        const updated = { ...displayTime, [type]: token };
        setTypeTime(updated);
        if (isAllPlaceholderTokens(updated, showSeconds)) {
          onChange?.("");
        }
        return token;
      }

      if (inputText.length === 1) {
        const paddedValue = inputText.padStart(2, "0");
        updateFieldValue(type, paddedValue);
        return paddedValue;
      }

      if (inputText.length === 2) {
        updateFieldValue(type, inputText);
        return inputText;
      }

      const lastTwo = inputText.slice(-2);
      updateFieldValue(type, lastTwo);
      return lastTwo;
    },
    [displayTime, onChange, showSeconds, updateFieldValue]
  );

  return {
    isValidTime,
    displayTime,
    handleFieldInput,
    setTypeTime,
  };
}
