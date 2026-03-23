import { FieldType } from "@/shared/types";

import { AMPMField } from "./AMPMField";
import { NumericField } from "../DateInput/DateField";

type TimeFieldType = Extract<FieldType, "hour" | "minute" | "second">;

interface BaseTimeFieldsProps {
  ref: React.RefObject<HTMLDivElement | null>;
  currentTime: {
    hour: string;
    minute: string;
    second?: string | undefined;
    ampm?: string | undefined;
  };
  hourRef: React.RefObject<HTMLSpanElement | null>;
  minuteRef: React.RefObject<HTMLSpanElement | null>;
  onInput: (type: TimeFieldType | "ampm", inputText: string) => string;
  onFocus: (e: React.FocusEvent<HTMLSpanElement>) => void;
  onBeforeInput: (e: React.FormEvent<HTMLSpanElement>) => void;
  disabled?: boolean;
  showAmPm?: boolean;
}

interface TimeFieldsPropsWithoutSeconds extends BaseTimeFieldsProps {
  showSeconds?: false;
  secondRef?: React.RefObject<HTMLSpanElement | null>;
  ampmRef?: React.RefObject<HTMLSpanElement | null>;
}

interface TimeFieldsPropsWithSeconds extends BaseTimeFieldsProps {
  showSeconds: true;
  secondRef: React.RefObject<HTMLSpanElement | null>;
  ampmRef?: React.RefObject<HTMLSpanElement | null>;
}

type TimeFieldsProps =
  | TimeFieldsPropsWithoutSeconds
  | TimeFieldsPropsWithSeconds;

export const TimeFields: React.FC<TimeFieldsProps> = ({
  currentTime,
  hourRef,
  minuteRef,
  secondRef,
  ampmRef,
  onInput,
  onFocus,
  onBeforeInput,
  disabled,
  showSeconds = false,
  showAmPm = false,
  ref,
}) => {
  return (
    <div
      ref={ref}
      className="flex flex-grow items-center text-grey-500 bg-transparent border-none h-full"
    >
      {showAmPm && (
        <AMPMField
          ref={ampmRef!}
          type="ampm"
          value={currentTime.ampm ?? ""}
          tabIndex={disabled ? -1 : showSeconds ? 4 : 3}
          onInput={onInput}
          onFocus={onFocus}
          onBeforeInput={onBeforeInput}
          placeholder="오전"
          className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[32px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
        />
      )}
      <NumericField
        ref={hourRef}
        type="hour"
        value={currentTime.hour}
        tabIndex={disabled ? -1 : 1}
        onInput={onInput}
        onFocus={onFocus}
        onBeforeInput={onBeforeInput}
        placeholder="HH"
        className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[32px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
          }`}
      />
      <span className="text-grey-400 mx-1">:</span>
      <NumericField
        ref={minuteRef}
        type="minute"
        value={currentTime.minute}
        tabIndex={disabled ? -1 : 2}
        onInput={onInput}
        onFocus={onFocus}
        onBeforeInput={onBeforeInput}
        placeholder="MM"
        className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[32px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
          }`}
      />
      {showSeconds && (
        <>
          <span className="text-grey-400 mx-1">:</span>
          <NumericField
            ref={secondRef!}
            type="second"
            value={currentTime.second || ""}
            tabIndex={disabled ? -1 : 3}
            onInput={onInput}
            onFocus={onFocus}
            onBeforeInput={onBeforeInput}
            placeholder="SS"
            className={`outline-none px-[4px] py-[2px] rounded text-center focus:bg-grey-100 min-w-[32px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
              }`}
          />
        </>
      )}
    </div>
  );
};

TimeFields.displayName = "TimeFields";
