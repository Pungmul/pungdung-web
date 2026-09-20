import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { KeyboardEventHandler, RefObject } from "react";

interface SelectTriggerProps {
  activeOptionId?: string | undefined;
  disabled?: boolean | undefined;
  errorId?: string | undefined;
  hasSearch: boolean;
  isListOpen: boolean;
  labelledBy: string;
  listboxId: string;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  onToggle: () => void;
  placeholderText: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  valueId: string;
  valueText: string;
}

export function SelectTrigger({
  activeOptionId,
  disabled,
  errorId,
  hasSearch,
  isListOpen,
  labelledBy,
  listboxId,
  onKeyDown,
  onToggle,
  placeholderText,
  triggerId,
  triggerRef,
  valueId,
  valueText,
}: SelectTriggerProps) {
  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      role={hasSearch ? undefined : "combobox"}
      aria-expanded={isListOpen}
      aria-haspopup="listbox"
      aria-controls={isListOpen ? listboxId : undefined}
      aria-activedescendant={!hasSearch ? activeOptionId : undefined}
      aria-labelledby={labelledBy}
      aria-describedby={errorId}
      disabled={disabled}
      className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] w-full text-left ${errorId
        ? "border-red-400"
        : "border-grey-300 focus:border-grey-500"
        } ${disabled
          ? "bg-grey-100 text-grey-400 cursor-not-allowed"
          : "cursor-pointer hover:border-grey-400"
        }`}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      <span
        id={valueId}
        className={`flex-grow w-full px-0.5 ${!valueText ? "text-grey-300" : "text-grey-500"
          }`}
      >
        {valueText || placeholderText}
      </span>
      <span
        className={`flex size-5 shrink-0 items-center justify-center ${isListOpen ? "rotate-180" : ""
          } transition-transform duration-200`}
        aria-hidden
      >
        <ChevronDownIcon className="size-full stroke-[1.5px] text-grey-400" />
      </span>
    </button>
  );
}
