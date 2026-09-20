"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SelectorItem } from "./type";

function filterSelectItems<V>(items: SelectorItem<V>[], searchText: string) {
  if (searchText.trim() === "") {
    return items;
  }

  return items.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );
}

interface UseSelectKeyboardNavigationParams<V> {
  hasSearch: boolean;
  items: SelectorItem<V>[];
  onChange?: ((value: V | null) => void) | undefined;
  value: V | null;
}

export function useSelectKeyboardNavigation<V>({
  hasSearch,
  items,
  onChange,
  value,
}: UseSelectKeyboardNavigationParams<V>) {
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filteredItems = useMemo(
    () => filterSelectItems(items, searchText),
    [items, searchText]
  );

  const closeList = useCallback(() => {
    setIsListOpen(false);
    setSearchText("");
    setActiveIndex(null);
  }, []);

  const openList = useCallback(
    (direction: "first" | "last" = "first") => {
      const selectedIndex = filteredItems.findIndex((item) => item.value === value);
      const defaultIndex = direction === "last" ? filteredItems.length - 1 : 0;

      setIsListOpen(true);
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : defaultIndex);
    },
    [filteredItems, value]
  );

  const moveActiveOption = useCallback(
    (direction: "next" | "previous") => {
      setActiveIndex((currentIndex) => {
        if (filteredItems.length === 0) {
          return null;
        }
        if (currentIndex === null) {
          return direction === "next" ? 0 : filteredItems.length - 1;
        }

        const nextIndex =
          direction === "next" ? currentIndex + 1 : currentIndex - 1;
        return Math.max(0, Math.min(nextIndex, filteredItems.length - 1));
      });
    },
    [filteredItems.length]
  );

  const selectActiveOption = useCallback(() => {
    if (activeIndex === null) {
      return false;
    }

    const activeItem = filteredItems[activeIndex];
    if (!activeItem) {
      return false;
    }

    onChange?.(activeItem.value);
    closeList();
    return true;
  }, [activeIndex, closeList, filteredItems, onChange]);

  const focusTrigger = useCallback(() => {
    buttonRef.current?.focus();
  }, []);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isListOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeList();
        focusTrigger();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isListOpen) {
          openList(event.key === "ArrowDown" ? "first" : "last");
          return;
        }
        moveActiveOption(event.key === "ArrowDown" ? "next" : "previous");
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (isListOpen) {
          selectActiveOption();
        } else {
          openList();
        }
      }
    },
    [closeList, focusTrigger, isListOpen, moveActiveOption, openList, selectActiveOption]
  );

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && isListOpen) {
        event.preventDefault();
        if (selectActiveOption()) {
          focusTrigger();
        }
        return;
      }

      handleTriggerKeyDown(event);
    },
    [focusTrigger, handleTriggerKeyDown, isListOpen, selectActiveOption]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextSearchText = event.target.value;
      const nextItems = filterSelectItems(items, nextSearchText);
      const selectedIndex = nextItems.findIndex((item) => item.value === value);

      setSearchText(nextSearchText);
      setActiveIndex(
        selectedIndex >= 0 ? selectedIndex : nextItems.length > 0 ? 0 : null
      );
    },
    [items, value]
  );

  useEffect(() => {
    if (isListOpen && hasSearch) {
      searchInputRef.current?.focus();
    }
  }, [hasSearch, isListOpen]);

  useEffect(() => {
    if (!isListOpen) {
      return;
    }

    const selectedIndex = filteredItems.findIndex((item) => item.value === value);
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : filteredItems.length > 0 ? 0 : null
    );
  }, [filteredItems, isListOpen, value]);

  return {
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
  };
}
