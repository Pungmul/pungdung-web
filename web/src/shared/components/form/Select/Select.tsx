"use client";

import {
  Children,
  type FocusEvent,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { InputHTMLAttributes } from "react";

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { josa } from "es-hangul";

import { useClickOutside } from "@/shared/hooks";

import type { SelectorItem } from "./type";
import { useSelectContainedBlur } from "./useSelectContainedBlur";
import SearchInput from "../SearchInput";

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
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeList = useCallback(() => {
    setIsListOpen(false);
    setSearchText("");
  }, []);

  const handleFocusLeave = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      closeList();
      onBlur?.(event);
    },
    [closeList, onBlur]
  );
  const { rootRef, handleBlur, handleFocus } =
    useSelectContainedBlur(handleFocusLeave);
  const items = extractSelectItems<V>(children);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeList();
      }
    },
    [closeList]
  );

  const selectedItem = items.find((item) => item.value === value);
  const displayValue = selectedItem ? selectedItem.label : "";
  const placeholderText =
    placeholder ?? `${josa(label ?? "", "을/를")} 선택해주세요`;
  const labelId = `${name}-label`;
  const valueId = `${name}-value`;
  const triggerId = `${name}-trigger`;
  const listboxId = `${name}-listbox`;
  const errorId = `${name}-error`;

  const handleSelect = (item: SelectorItem<V>) => {
    onChange?.(item.value as V);
    closeList();
  };

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
        aria-expanded={isListOpen}
        aria-haspopup="listbox"
        aria-controls={isListOpen ? listboxId : undefined}
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
            setIsListOpen(!isListOpen);
          }
        }}
        onKeyDown={handleKeyDown}
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
          onClose={closeList}
          rootRef={rootRef}
          items={items}
          selectedValue={value ?? null}
          onSelect={handleSelect}
          label={label}
          listboxId={listboxId}
          hasSearch={hasSearch}
          searchText={searchText}
          setSearchText={setSearchText}
          buttonRef={buttonRef}
          listRef={listRef}
        />
      )}
    </div>
  );
}

function SelectItem<V>({
  item,
  selectedValue,
  onSelect,
}: {
  item: SelectorItem<V>;
  selectedValue: V | null | undefined;
  onSelect: (item: SelectorItem<V>) => void;
}) {
  const isSelected = item.value === selectedValue;

  return (
    <li
      role="option"
      aria-selected={isSelected}
      className="group w-full cursor-pointer px-2 py-1 text-[14px] leading-5"
      onMouseDown={(event) => {
        // 옵션 클릭의 포커스 이동이 선택보다 먼저 blur를 내지 않게 함
        event.preventDefault();
      }}
      onClick={() => onSelect(item)}
    >
      <div
        className={`w-full cursor-pointer rounded-sm px-2 py-2.5 text-[14px] leading-5 group-hover:bg-grey-100 ${isSelected ? "bg-grey-100 font-semibold text-grey-800" : "text-grey-500"
          }`}
      >
        {item.label}
      </div>
    </li>
  );
}

function SelectList<V>({
  items,
  selectedValue,
  onSelect,
  onClose,
  hasSearch = false,
  label,
  listboxId,
  searchText,
  setSearchText,
  buttonRef,
  listRef,
  rootRef,
}: {
  items: SelectorItem<V>[];
  selectedValue: V | null;
  onSelect: (item: SelectorItem<V>) => void;
  onClose: () => void;
  hasSearch?: boolean;
  label: string;
  listboxId: string;
  searchText: string;
  setSearchText: (text: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const filteredItems =
    searchText.trim() !== ""
      ? items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
      : items;

  useClickOutside({
    refs: [listRef, buttonRef],
    // mousedown에서 닫으면 검색 인풋이 먼저 사라져 blur를 놓침
    eventType: "click",
    onOutsideClick: () => {
      const active = document.activeElement;
      if (active instanceof Node && rootRef.current?.contains(active)) {
        onClose();
      }
    },
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="absolute top-full left-0 z-10 mt-[4px] w-full overflow-hidden rounded border border-grey-300 bg-background shadow-lg"
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-label={`${label} 선택`}
    >
      {hasSearch && (
        <div className="bg-background p-[8px]">
          <SearchInput
            id={`${listboxId}-search`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={`${label} 검색`}
          />
        </div>
      )}

      <ul className="flex max-h-[144px] list-none flex-col overflow-y-auto">
        {filteredItems.length > 0
          ? filteredItems.map((item, idx) => (
            <SelectItem
              key={`select-item-${idx}-${item.label}`}
              item={item}
              selectedValue={selectedValue}
              onSelect={onSelect}
            />
          ))
          : searchText && (
            <div className="w-full text-grey-500 text-center p-[16px] text-[14px]">
              검색 결과가 없습니다
            </div>
          )}
      </ul>
    </div>
  );
}

// 컴파운드 컴포넌트로 Select.Option 추가
Select.Option = SelectOption;

export default Select;
