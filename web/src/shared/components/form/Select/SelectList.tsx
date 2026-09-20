"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
} from "react";

import { SelectItem } from "./SelectItem";
import type { SelectorItem } from "./type";
import SearchInput from "../SearchInput";

interface SelectListProps<V> {
  activeIndex: number | null;
  hasSearch?: boolean;
  items: SelectorItem<V>[];
  label: string;
  listboxId: string;
  listRef: RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (item: SelectorItem<V>) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchText: string;
  selectedValue: V | null;
}

export function SelectList<V>({
  activeIndex,
  hasSearch = false,
  items,
  label,
  listboxId,
  listRef,
  onDismiss,
  onSearchChange,
  onSearchKeyDown,
  onSelect,
  searchInputRef,
  searchText,
  selectedValue,
}: SelectListProps<V>) {
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, listboxId]);

  return (
    <div
      ref={listRef}
      className="absolute top-full left-0 z-10 mt-[4px] w-full overflow-hidden rounded border border-grey-300 bg-background shadow-lg"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        }
      }}
    >
      {hasSearch && (
        <div className="bg-background p-[8px]">
          <SearchInput
            ref={searchInputRef}
            id={`${listboxId}-search`}
            value={searchText}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex === null
                ? undefined
                : `${listboxId}-option-${activeIndex}`
            }
            aria-autocomplete="list"
            placeholder={`${label} 검색`}
          />
        </div>
      )}

      <ul
        id={listboxId}
        role="listbox"
        aria-label={`${label} 선택`}
        className="flex max-h-[144px] list-none flex-col overflow-y-auto py-1"
      >
        {items.map((item, index) => (
          <SelectItem
            key={`select-item-${index}-${item.label}`}
            id={`${listboxId}-option-${index}`}
            item={item}
            selectedValue={selectedValue}
            isActive={index === activeIndex}
            onSelect={onSelect}
          />
        ))}
      </ul>
      {items.length === 0 && searchText && (
        <div
          role="status"
          className="w-full text-grey-500 text-center p-[16px] text-[14px]"
        >
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
