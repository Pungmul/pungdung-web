"use client";

import { type FocusEvent, ReactNode, useCallback, useMemo, useRef } from "react";
import { InputHTMLAttributes } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { josa } from "es-hangul";

import { useClickOutside } from "@/shared/hooks";

import { extractSelectItems } from "./extractSelectItems";
import { SelectList } from "./SelectList";
import { SelectNativeField } from "./SelectNativeField";
import { SelectTrigger } from "./SelectTrigger";
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
  const items = useMemo(
    () => extractSelectItems<V>(children, SelectOption),
    [children]
  );
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
  const labelledBy =
    label.trim().length > 0 ? `${labelId} ${valueId}` : valueId;

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

      <SelectNativeField
        name={name}
        value={value}
        items={items}
        placeholderText={placeholderText}
        disabled={disabled}
        onChange={onChange}
      />

      <SelectTrigger
        triggerRef={buttonRef}
        triggerId={triggerId}
        valueId={valueId}
        valueText={displayValue}
        placeholderText={placeholderText}
        labelledBy={labelledBy}
        listboxId={listboxId}
        activeOptionId={activeOptionId}
        errorId={errorMessage ? errorId : undefined}
        disabled={disabled}
        hasSearch={hasSearch}
        isListOpen={isListOpen}
        onToggle={() => {
          if (isListOpen) {
            closeList();
          } else {
            openList();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      />

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
