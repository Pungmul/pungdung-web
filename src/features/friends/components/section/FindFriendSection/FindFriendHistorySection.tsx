"use client";

import React from "react";

import { ClockIcon } from "@heroicons/react/24/outline";

import FindFriendHistoryList from "./FindFriendHistoryList";
import { useSearchFriendHistorysViewModel } from "../../../hooks/view-model";

/** 키워드가 없을 때만 마운트 — 검색 기록 뷰모델·구역 제목 */
const FindFriendHistorySection: React.FC = () => {
  const searchHistoryForDisplay = useSearchFriendHistorysViewModel();

  if (searchHistoryForDisplay.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      <h4 className="text-sm text-grey-500 pb-4 px-1">
        <ClockIcon className="size-5 text-grey-500 inline-block mr-1 align-middle" />
        검색 기록
      </h4>
      <FindFriendHistoryList items={searchHistoryForDisplay} />
    </div>
  );
};

export default FindFriendHistorySection;
