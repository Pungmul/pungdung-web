"use client";

import {
  Children,
  createContext,
  type FocusEventHandler,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { InputHTMLAttributes } from "react";

import { FieldValues, Path } from "react-hook-form";

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { josa } from "es-hangul";

import { useClickOutside } from "@/shared/hooks";

import SearchInput from "./SearchInput";

export interface SelectorItem<T> {
  label: string;
  value: T | null;
}

interface SelectContextValue<T extends FieldValues, V extends T[keyof T]> {
  items: SelectorItem<V>[];
  selectedValue: V | null;
  onSelect: (item: SelectorItem<V>) => void;
  isListOpen: boolean;
  setIsListOpen: (open: boolean) => void;
  hasSearch: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  label: string;
  errorMessage?: string | undefined;
  disabled?: boolean | undefined;
}

const SelectContext = createContext<SelectContextValue<FieldValues, FieldValues[keyof FieldValues]> | null>(null);

interface SelectProps<T extends FieldValues, V extends T[keyof T]>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "disabled" | "onBlur"
  > {
  name: Path<T>;
  label: string;
  hasSearch?: boolean;
  placeholder?: string;
  className?: string;
  errorMessage?: string | undefined;
  onChange?: ((value: V | null) => void) | undefined;
  children: ReactNode;
  value: V | null;
  disabled?: boolean | undefined;
  onBlur?: FocusEventHandler<HTMLElement> | undefined;
}

interface SelectOptionProps<V> {
  value: V;
  children: ReactNode;
}

// Select.Option 컴포넌트
function SelectOption<V>({ value, children }: SelectOptionProps<V>) {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("SelectOption must be used within a Select component");
  }

  const { onSelect } = context;

  const handleClick = () => {
    onSelect({ label: String(children), value });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

// 메인 Select 컴포넌트
export function Select<T extends FieldValues, V extends T[keyof T]>({
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
}: SelectProps<T, V>) {
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState<SelectorItem<V>[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleCloseList = useCallback(() => {
    setIsListOpen(false);
    setSearchText("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseList();
      }
    },
    [handleCloseList]
  );

  // children에서 Option들을 추출하여 items 배열 생성
  useEffect(() => {
    const extractedItems: SelectorItem<V>[] = [];

    const extractOptions = (children: ReactNode) => {
      Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === SelectOption) {
          const props = child.props as SelectOptionProps<V>;
          const { value, children: optionChildren } = props;
          extractedItems.push({
            label: String(optionChildren),
            value: value as V,
          });
        }
      });
    };

    extractOptions(children);
    setItems(extractedItems);
  }, [children]);

  const selectedItem = items.find((item) => item.value === value);
  const displayValue = selectedItem ? selectedItem.label : "";

  const handleSelect = (item: SelectorItem<V>) => {
    onChange?.(item.value as V);
    handleCloseList();
  };

  const contextValue: SelectContextValue<T, V> = {
    items,
    selectedValue: value as V | null,
    onSelect: handleSelect,
    isListOpen,
    setIsListOpen,
    hasSearch,
    searchText,
    setSearchText,
    label,
    errorMessage,
    disabled,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="w-full relative flex flex-col gap-[4px]">
        {label.trim().length > 0 && (
          <label htmlFor={name} className="text-grey-400 px-[4px] text-[14px]">
            {label}
          </label>
        )}

        {/* 실제 select 요소 (접근성을 위해 숨김) */}
        <select
          id={name}
          name={name}
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
            {placeholder || `${josa(label ?? "", "을/를")} 선택해주세요`}
          </option>
          {items.map((item, index) => (
            <option key={index} value={String(item.value)}>
              {item.label}
            </option>
          ))}
        </select>

        {/* 커스텀 셀렉트 버튼 */}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isListOpen}
          aria-haspopup="listbox"
          aria-labelledby={label}
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
          onBlur={onBlur}
        >
          <span
            className={`flex-grow w-full ${!displayValue ? "text-grey-300" : "text-grey-500"
              }`}
          >
            {displayValue !== undefined && displayValue.trim().length > 0
              ? displayValue
              : placeholder ?? `${josa(label ?? "", "을/를")} 선택해주세요`}
          </span>
          <span
            className={`flex size-5 shrink-0 items-center justify-center ${isListOpen ? "rotate-180" : ""
              } transition-transform duration-200`}
          >
            <ChevronDownIcon className="size-full stroke-[1.5px] text-grey-400" />
          </span>
        </button>

        {errorMessage && (
          <div className="flex flex-row items-center gap-[4px]">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <ExclamationCircleIcon className="size-full text-red-400" />
            </span>
            <div className="text-red-500 max-w-full text-[12px]">
              {errorMessage}
            </div>
          </div>
        )}

        {isListOpen && (
          <SelectList
            onClose={handleCloseList}
            items={items}
            selectedValue={value ?? null}
            onSelect={handleSelect}
            label={label}
            hasSearch={hasSearch}
            searchText={searchText}
            setSearchText={setSearchText}
            buttonRef={buttonRef}
            listRef={listRef}
          />
        )}
      </div>
    </SelectContext.Provider>
  );
}

function SelectItem<T extends FieldValues, V extends T[keyof T]>({
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
      className={`w-full p-[12px] cursor-pointer hover:bg-grey-100 text-[14px] ${isSelected ? "text-grey-800 font-semibold bg-grey-100" : "text-grey-500"
        }`}
      onClick={() => onSelect(item)}
    >
      {item.label}
    </li>
  );
}

function SelectList<T extends FieldValues, V extends T[keyof T]>({
  items,
  selectedValue,
  onSelect,
  onClose,
  hasSearch = false,
  label,
  searchText,
  setSearchText,
  buttonRef,
  listRef,
}: {
  items: SelectorItem<V>[];
  selectedValue: V | null;
  onSelect: (item: SelectorItem<V>) => void;
  onClose: () => void;
  hasSearch?: boolean;
  label: string;
  searchText: string;
  setSearchText: (text: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const filteredItems =
    searchText.trim() !== ""
      ? items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
      : items;

  useClickOutside({
    refs: [listRef, buttonRef],
    onOutsideClick: onClose,
    eventType: "click",
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
      className="absolute top-full left-0 w-full overflow-y-auto z-10 mt-[4px] max-h-[200px] border border-grey-300 rounded bg-background shadow-lg"
      ref={listRef}
      role="listbox"
      aria-label={`${label} 선택`}
    >
      {/* 검색 영역 */}
      {hasSearch && (
        <div className="sticky top-0 bg-background p-[8px]">
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClose={onClose}
            placeholder={`${label} 검색`}
          />
        </div>
      )}

      {/* 옵션 목록 */}
      <ul className="flex flex-col list-none">
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
