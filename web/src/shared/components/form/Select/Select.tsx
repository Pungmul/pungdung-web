"use client";

import {
  Children,
  type FocusEvent,
  isValidElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { InputHTMLAttributes } from "react";

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { josa } from "es-hangul";

import { useClickOutside } from "@/shared/hooks";

import { SelectList } from "./SelectList";
import type { SelectorItem } from "./type";
import { useSelectContainedBlur } from "./useSelectContainedBlur";
import { useSelectKeyboardNavigation } from "./useSelectKeyboardNavigation";

interface SelectProps<V>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "disabled" | "onBlur"
  > {
  name: string;
  label: string;
  hasSearch?: boolean;
  placeholder?: string;
  className?: string;
  errorMessage?: string | undefined;
  onChange?: ((value: V | null) => void) | undefined;
  children: ReactNode;
  value: V | null;
  disabled?: boolean | undefined;
  onBlur?: ((event?: FocusEvent<HTMLElement>) => void) | undefined;
}

interface SelectOptionProps<V> {
  value: V;
  children: ReactNode;
}

function SelectOption<V>({ children }: SelectOptionProps<V>) {
  return <>{children}</>;
}

function extractSelectItems<V>(children: ReactNode): SelectorItem<V>[] {
  const items: SelectorItem<V>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== SelectOption) {
      return;
    }

    const { value, children: optionChildren } =
      child.props as SelectOptionProps<V>;

    items.push({
      label: String(optionChildren),
      value: value as V,
    });
  });

  return items;
}

// 메인 Select 컴포넌트
export function Select<V>({
  hasSearch = false,
  label,
  name,
  errorMessage,
  onChange,
  value,
  children,
  placeholder,
  disabled,
  onBlur,
}: SelectProps<V>) {
  const listRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => extractSelectItems<V>(children), [children]);
  const {
    activeIndex,
    buttonRef,
    closeList,
    filteredItems,
    focusTrigger,
    handleSearchChange,
    handleSearchKeyDown,
    handleTriggerKeyDown,
    isListOpen,
    openList,
    searchText,
    searchInputRef,
  } = useSelectKeyboardNavigation({ hasSearch, items, onChange, value });

  const handleFocusLeave = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      closeList();
      onBlur?.(event);
    },
    [closeList, onBlur]
  );
  const { rootRef, handleBlur, handleFocus } =
    useSelectContainedBlur(handleFocusLeave);

  useClickOutside({
    refs: [listRef, buttonRef],
    enabled: isListOpen,
    eventType: "click",
    onOutsideClick: () => {
      const active = document.activeElement;
      if (active instanceof Node && rootRef.current?.contains(active)) {
        closeList();
      }
    },
  });

  const selectedItem = items.find((item) => item.value === value);
  const displayValue = selectedItem ? selectedItem.label : "";
  const placeholderText =
    placeholder ?? `${josa(label ?? "", "을/를")} 선택해주세요`;
  const labelId = `${name}-label`;
  const valueId = `${name}-value`;
  const triggerId = `${name}-trigger`;
  const listboxId = `${name}-listbox`;
  const errorId = `${name}-error`;
  const activeOptionId =
    activeIndex === null ? undefined : `${listboxId}-option-${activeIndex}`;

  const handleSelect = (item: SelectorItem<V>) => {
    onChange?.(item.value as V);
    closeList();
    focusTrigger();
  };

  const handleDismissList = useCallback(() => {
    closeList();
    focusTrigger();
  }, [closeList, focusTrigger]);

  return (
    <div
      ref={rootRef}
      className="w-full relative flex flex-col gap-[4px]"
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {label.trim().length > 0 && (
        <label
          id={labelId}
          htmlFor={triggerId}
          className="text-grey-400 px-1 text-[14px]"
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        tabIndex={-1}
        disabled={disabled}
        value={
          value === undefined || value === null || value === ""
            ? "placeholder"
            : String(value)
        }
        onChange={(e) => {
          const selectedValue = e.target.value;
          const item = items.find(
            (item) => String(item.value) === selectedValue
          );
          onChange?.(item?.value as V | null);
        }}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="placeholder" disabled>
          {placeholderText}
        </option>
        {items.map((item, index) => (
          <option key={index} value={String(item.value)}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        ref={buttonRef}
        id={triggerId}
        type="button"
        role={hasSearch ? undefined : "combobox"}
        aria-expanded={isListOpen}
        aria-haspopup="listbox"
        aria-controls={isListOpen ? listboxId : undefined}
        aria-activedescendant={!hasSearch ? activeOptionId : undefined}
        aria-labelledby={
          label.trim().length > 0 ? `${labelId} ${valueId}` : valueId
        }
        aria-describedby={errorMessage ? errorId : undefined}
        disabled={disabled}
        className={`relative flex flex-row items-center border-[2px] box-border gap-[8px] px-[8px] h-[48px] rounded-[5px] w-full text-left ${errorMessage
          ? "border-red-400"
          : "border-grey-300 focus:border-grey-500"
          } ${disabled
            ? "bg-grey-100 text-grey-400 cursor-not-allowed"
            : "cursor-pointer hover:border-grey-400"
          }`}
        onClick={() => {
          if (!disabled) {
            if (isListOpen) {
              closeList();
            } else {
              openList();
            }
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          id={valueId}
          className={`flex-grow w-full px-0.5 ${!displayValue ? "text-grey-300" : "text-grey-500"
            }`}
        >
          {displayValue !== undefined && displayValue.trim().length > 0
            ? displayValue
            : placeholderText}
        </span>
        <span
          className={`flex size-5 shrink-0 items-center justify-center ${isListOpen ? "rotate-180" : ""
            } transition-transform duration-200`}
          aria-hidden
        >
          <ChevronDownIcon className="size-full stroke-[1.5px] text-grey-400" />
        </span>
      </button>

      {errorMessage && (
        <div className="flex flex-row items-center gap-[4px]">
          <span
            className="flex size-4 shrink-0 items-center justify-center"
            aria-hidden
          >
            <ExclamationCircleIcon className="size-full text-red-400" />
          </span>
          <div id={errorId} className="text-red-500 max-w-full text-[12px]">
            {errorMessage}
          </div>
        </div>
      )}

      {isListOpen && (
        <SelectList
          onDismiss={handleDismissList}
          items={filteredItems}
          selectedValue={value ?? null}
          onSelect={handleSelect}
          label={label}
          listboxId={listboxId}
          hasSearch={hasSearch}
          searchText={searchText}
          onSearchChange={handleSearchChange}
          searchInputRef={searchInputRef}
          listRef={listRef}
          activeIndex={activeIndex}
          onSearchKeyDown={handleSearchKeyDown}
        />
      )}
    </div>
  );
}

// 컴파운드 컴포넌트로 Select.Option 추가
Select.Option = SelectOption;

export default Select;
