"use client";

import React from "react";

import {
  useApplySearchHistoryAction,
  useDeleteSearchHistoryAction,
  useOpenProfileBySearchResultItem,
} from "../../../hooks/actions";
import type { SearchFriendHistoryItem } from "../../../types";
import FindFriendHistoryItem from "../../ui/FindFriendHistoryItem";

type FindFriendHistoryListProps = {
  items: SearchFriendHistoryItem[];
};

/**
 * 빈 상태 또는 `<ul>` map만.
 * 기록 선택·삭제·유저 행 프로필 열기만 조합한다 (친구 요청/수락은 프로필 모달).
 */
const FindFriendHistoryList: React.FC<FindFriendHistoryListProps> = ({
  items,
}) => {
  const { handleHistorySelect } = useApplySearchHistoryAction();
  const { handleHistoryDelete } = useDeleteSearchHistoryAction();
  const { openProfile, onOpenProfileKeyDown } =
    useOpenProfileBySearchResultItem();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[12rem] flex-col items-center justify-center px-4 py-4">
        <p className="text-center text-sm text-grey-500">검색 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 list-none">
      {items.map((entry) => (
        <FindFriendHistoryItem
          key={entry.id}
          entry={entry}
          onHistorySelect={handleHistorySelect}
          onHistoryDelete={handleHistoryDelete}
          onOpenProfile={openProfile}
          onKeyDown={onOpenProfileKeyDown}
        />
      ))}
    </ul>
  );
};

export default FindFriendHistoryList;
