"use client";

import { useEffect, useMemo, useState } from "react";

import { debounce } from "lodash";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";

import type { LocationType } from "@/features/location";

import {
  E2E_PLACE_NAME_STR,
  E2E_PLACE_POINT,
  E2E_PLACE_SEARCH_ALIAS_STR,
  LOCATION_SEARCH_FAIL_STR,
} from "../../lib/location-search-copy";

type E2eLocationMapPickerProps = {
  onLocationChange?: (location: LocationType, address: string) => void;
  showSearchBar?: boolean;
  className?: string;
};

const E2E_PLACE_SEARCH_DEBOUNCE_MS = 500;

export function E2eLocationMapPicker({
  onLocationChange,
  showSearchBar = true,
  className = "",
}: E2eLocationMapPickerProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [searchFailed, setSearchFailed] = useState(false);
  const [matchedPlaceName, setMatchedPlaceName] = useState<string | null>(null);

  const runSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        const trimmed = keyword.trim();
        if (!trimmed) {
          setSearchFailed(false);
          setMatchedPlaceName(null);
          return;
        }

        if (trimmed === E2E_PLACE_NAME_STR || trimmed === E2E_PLACE_SEARCH_ALIAS_STR) {
          setSearchFailed(false);
          setMatchedPlaceName(E2E_PLACE_NAME_STR);
          return;
        }

        setMatchedPlaceName(null);
        setSearchFailed(true);
      }, E2E_PLACE_SEARCH_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    runSearch(searchValue);
    return () => {
      runSearch.cancel();
    };
  }, [runSearch, searchValue]);

  const handleSelect = (placeName: string) => {
    setSelectedAddress(placeName);
    setSearchValue("");
    setMatchedPlaceName(null);
    setSearchFailed(false);
    onLocationChange?.(E2E_PLACE_POINT, placeName);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showSearchBar ? (
        <div className="relative w-full flex flex-col gap-2">
          <div className="flex flex-row gap-2 p-2 rounded-lg bg-grey-100 border border-grey-100 focus-within:border-grey-400">
            <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
              <MagnifyingGlassIcon className="size-full text-grey-400" />
            </span>
            <input
              type="text"
              aria-label="주소 검색"
              className="flex-grow bg-transparent outline-none font-light border-none"
              placeholder="주소 검색"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            {searchValue.trim() !== "" ? (
              <button
                type="button"
                aria-label="검색어 지우기"
                className="flex size-6 shrink-0 items-center justify-center"
                onClick={() => setSearchValue("")}
              >
                <XCircleIcon className="size-full text-grey-400" aria-hidden />
              </button>
            ) : null}
          </div>
          {searchFailed ? (
            <p className="text-[12px] text-red-500">{LOCATION_SEARCH_FAIL_STR}</p>
          ) : null}
          {matchedPlaceName ? (
            <div className="absolute bg-background top-full left-0 w-full z-10 flex flex-col gap-2 overflow-y-auto max-h-[200px] border border-grey-200 rounded-lg shadow-lg">
              <button
                type="button"
                className="flex flex-col gap-1 px-3 py-2 text-left hover:bg-grey-100"
                onClick={() => handleSelect(matchedPlaceName)}
              >
                <div className="text-sm font-medium text-grey-800">
                  {matchedPlaceName}
                </div>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {selectedAddress ? (
        <div className="text-sm text-grey-600 bg-grey-100 p-3 rounded-lg">
          <p className="font-medium">선택된 주소:</p>
          <p className="font-semibold text-grey-800">{selectedAddress}</p>
        </div>
      ) : null}
    </div>
  );
}
