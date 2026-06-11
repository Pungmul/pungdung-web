"use client";

import { useCallback, useMemo, useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { match } from "ts-pattern";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const REVEAL_YEAR_COUNT = 15;

interface DatePickerProps {
  /** 현재 선택된 날짜 (YYYY-MM-DD) */
  value?: string;
  /** 날짜 선택 시 호출되는 함수 */
  onChange: (date: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  className = "",
}: DatePickerProps) {
  const [viewMode, setViewMode] = useState<"date" | "month" | "year">("date");
  const [innerValue, setInnerValue] = useState(
    value
      ? dayjs(value).isValid()
        ? dayjs(value).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs(innerValue));

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate =
      startOfMonth.day() === 1
        ? startOfMonth.startOf("week").add(1, "day")
        : startOfMonth.subtract(1, "day").startOf("week").add(1, "day");
    const endDate =
      endOfMonth.day() === 0
        ? endOfMonth
        : endOfMonth.endOf("week").add(1, "day");

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate)) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  }, [currentMonth]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  }, [currentMonth]);

  const goToPreviousYearList = useCallback(() => {
    setCurrentMonth(currentMonth.subtract(REVEAL_YEAR_COUNT, "year"));
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(currentMonth.add(1, "month"));
  }, [currentMonth]);

  const goToNextYearList = useCallback(() => {
    setCurrentMonth(currentMonth.add(REVEAL_YEAR_COUNT, "year"));
  }, [currentMonth]);

  const goToPreviousYear = useCallback(() => {
    setCurrentMonth(currentMonth.subtract(1, "year"));
  }, [currentMonth]);

  const goToNextYear = useCallback(() => {
    setCurrentMonth(currentMonth.add(1, "year"));
  }, [currentMonth]);

  const prevAction = useMemo(
    () =>
      viewMode === "date"
        ? goToPreviousMonth
        : viewMode === "year"
        ? goToPreviousYearList
        : goToPreviousYear,
    [viewMode, goToPreviousMonth, goToPreviousYearList, goToPreviousYear]
  );

  const nextAction = useMemo(
    () =>
      viewMode === "date"
        ? goToNextMonth
        : viewMode === "year"
        ? goToNextYearList
        : goToNextYear,
    [viewMode, goToNextMonth, goToNextYearList, goToNextYear]
  );

  // const goToToday = () => {
  //   onMonthChange(dayjs());
  //   onChange(dayjs().format("YYYY-MM-DD"));
  // };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("handleApply", innerValue);
    onChange(innerValue);
  };

  return (
    <div
      className={`flex flex-col p-4 cursor-default ${className}`}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {/* 헤더: 월/년 선택 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row items-center flex-grow">
          {viewMode !== "year" && (
            <div
              className="text-lg font-semibold p-[4px] hover:bg-grey-100 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                setViewMode("year");
              }}
            >
              {currentMonth.format("YYYY년")}
            </div>
          )}
          {viewMode === "date" && (
            <div
              className="text-lg font-semibold p-[4px] hover:bg-grey-100 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                setViewMode("month");
              }}
            >
              {currentMonth.format("MM월")}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={prevAction}
            className="flex size-8 items-center justify-center rounded-md hover:bg-grey-100"
            type="button"
          >
            <ChevronLeftIcon className="size-full" />
          </button>
          <button
            onClick={nextAction}
            className="flex size-8 items-center justify-center rounded-md hover:bg-grey-100"
            type="button"
          >
            <ChevronRightIcon className="size-full" />
          </button>
        </div>
      </div>

      {/* 날짜 그리드 */}
      {match(viewMode)
        .with("date", () => (
          <DateGrid
            calendarDays={calendarDays}
            currentMonth={currentMonth}
            innerValue={innerValue}
            setInnerValue={setInnerValue}
          />
        ))
        .with("month", () => (
          <MonthGrid
            currentMonth={currentMonth}
            innerValue={innerValue}
            setInnerValue={(date) => {
              setCurrentMonth(dayjs(date));
              setViewMode("date");
            }}
          />
        ))
        .with("year", () => (
          <YearGrid
            currentMonth={currentMonth}
            innerValue={innerValue}
            setInnerValue={(date) => {
              setCurrentMonth(dayjs(date));
              setViewMode("month");
            }}
          />
        ))
        .exhaustive()}
      {/* <DateGrid
        calendarDays={calendarDays}
        currentMonth={currentMonth}
        innerValue={innerValue}
        setInnerValue={setInnerValue}
      /> */}

      {/* 하단 버튼 */}
      <div className="flex gap-2 mt-4 flex-row-reverse">
        <button
          onClick={handleApply}
          className="py-2 px-4 bg-primary text-background rounded-md hover:bg-primary-light"
          type="button"
        >
          적용
        </button>
      </div>
    </div>
  );
}

const MonthGrid = ({
  currentMonth,
  innerValue,
  setInnerValue,
}: {
  currentMonth: Dayjs;
  innerValue: string;
  setInnerValue: (date: string) => void;
}) => {
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => currentMonth.month(i));
  }, [currentMonth]);
  return (
    <div className="grid grid-cols-3 gap-[4px] w-full min-h-[272px] items-center">
      {months.map((month, i) => {
        const isSelected =
          innerValue &&
          dayjs(innerValue).isSame(month, "month") &&
          month.isSame(currentMonth, "month");
        return (
          <div
            key={i}
            className={
              "text-center text-sm font-medium h-[36px] py-2 rounded-md cursor-pointer " +
              (isSelected
                ? "bg-primary text-background"
                : "hover:bg-grey-100 text-grey-600")
            }
            onClick={(e) => {
              e.preventDefault();
              setInnerValue(month.format("YYYY-MM-DD"));
            }}
          >
            {month.format("M월")}
          </div>
        );
      })}
    </div>
  );
};

const YearGrid = ({
  currentMonth,
  innerValue,
  setInnerValue,
}: {
  currentMonth: Dayjs;
  innerValue: string;
  setInnerValue: (date: string) => void;
}) => {
  const years = useMemo(() => {
    const startYear =
      currentMonth.year() - (currentMonth.year() % REVEAL_YEAR_COUNT);
    return Array.from({ length: REVEAL_YEAR_COUNT }, (_, i) =>
      currentMonth.year(startYear + i)
    );
  }, [currentMonth]);
  return (
    <div className="grid grid-cols-3 gap-[4px] w-full min-h-[272px]">
      {years.map((year) => {
        const isSelected = year.isSame(dayjs(innerValue), "year");
        return (
          <div
            key={year.year()}
            className={
              "text-center text-sm font-medium h-[36px] py-2 rounded-md cursor-pointer " +
              (isSelected
                ? "bg-primary text-background"
                : "hover:bg-grey-100 text-grey-600")
            }
            onClick={(e) => {
              e.preventDefault();
              setInnerValue(year.format("YYYY-MM-DD"));
            }}
          >
            {year.year()}
          </div>
        );
      })}
    </div>
  );
};

const DateGrid = ({
  calendarDays,
  currentMonth,
  innerValue,
  setInnerValue,
}: {
  calendarDays: Dayjs[];
  currentMonth: Dayjs;
  innerValue: string;
  setInnerValue: (date: string) => void;
}) => {
  const weeks = useMemo(
    () =>
      Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, i) =>
        calendarDays.slice(i * 7, i * 7 + 7)
      ),
    [calendarDays]
  );

  return (
    <>
      <div className="flex flex-row gap-[4px] justify-center w-full">
        {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium py-2 text-grey-400 size-[36px]"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-start min-h-[236px] gap-[4px]">
        {weeks.map((weekDays, weekIdx) => (
          <div
            key={weekIdx.toString()}
            className="flex flex-row gap-[4px] justify-center w-full"
          >
            {weekDays.map((day) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = day.isSame(dayjs(), "day");
              const isSelected =
                innerValue && day.isSame(dayjs(innerValue), "day");
              return (
                <button
                  key={weekIdx.toString() + day}
                  onClick={(e) => {
                    e.preventDefault();
                    setInnerValue(day.format("YYYY-MM-DD"));
                  }}
                  disabled={!isCurrentMonth}
                  type="button"
                  className={`
            aspect-square p-[8px] rounded-full text-sm size-[36px]
            ${!isCurrentMonth ? "text-grey-200 cursor-not-allowed" : ""}
            ${isCurrentMonth ? "hover:bg-grey-100" : ""}
            ${isToday && isCurrentMonth ? "border border-primary" : ""}
            ${isSelected ? "bg-primary text-background hover:bg-primary" : ""}
            ${!isSelected && isCurrentMonth ? "text-grey-600" : ""}
          `}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};
