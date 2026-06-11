import { useCallback, useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import { TimeInput } from "./form";
import { formatIntervalValue } from "./form/TimeInput/formatIntervalValue";
import { Modal } from "./ui";

interface TimePickerProps {
  trigger: React.ReactNode;
  onChange: (startTime: string, endTime: string) => void;
  value: {
    startTime: string | undefined;
    endTime: string | undefined;
  };
}

export default function TimePicker({
  trigger,
  onChange,
  value,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTime: oldStartTime, endTime: oldEndTime } = value;
  const [startTime, setStartTime] = useState<string>(oldStartTime ?? "");
  const [endTime, setEndTime] = useState<string>(oldEndTime ?? "");

  const nowTime = useMemo(() => dayjs().format("HH:mm"), []);

  const handleChange = useCallback(
    (startTime: string, endTime: string) => {
      setStartTime(startTime);
      setEndTime(endTime);
      onChange(startTime, endTime);
      setIsOpen(false);
    },
    [onChange]
  );

  useEffect(() => {
    setStartTime(oldStartTime ?? "");
    setEndTime(oldEndTime ?? "");
  }, [oldStartTime, oldEndTime]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hasHeader={false}
        className="overflow-visible"
        overflow="visible"
      >
        <div className="flex flex-col overflow-visible justify-center gap-[16px] h-[320px]">
          <TimeInput
            label="시작 시간"
            value={startTime}
            onChange={setStartTime}
            minTime={formatIntervalValue(nowTime, 5)}
            maxTime={formatIntervalValue(endTime, 5)}
          />
          <TimeInput
            label="종료 시간"
            value={formatIntervalValue(endTime, 5)}
            onChange={setEndTime}
            minTime={formatIntervalValue(startTime > nowTime ? startTime : nowTime, 5, 5)}
          />
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="flex flex-row justify-center">
            <button
              className="text-grey-500 py-[8px] px-[16px] rounded-md"
              onClick={() => {
                setStartTime("");
                setEndTime("");
              }}
            >
              초기화
            </button>
          </div>
          <button
            className="bg-primary text-white py-[8px] px-[16px] rounded-md disabled:bg-primary-light"
            disabled={!startTime.trim() || !endTime.trim()}
            onClick={() => handleChange(startTime, endTime)}
          >
            확인
          </button>
          <button
            className="text-primary py-[8px] px-[16px] rounded-md"
            onClick={() => setIsOpen(false)}
          >
            취소
          </button>
        </div>
      </Modal>
    </>
  );
}
