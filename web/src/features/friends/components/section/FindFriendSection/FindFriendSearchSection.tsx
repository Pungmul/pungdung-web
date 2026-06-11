"use client";

import React from "react";

import { Spinner } from "@/shared";

import { useOpenProfileBySearchResultItem } from "../../../hooks/actions";
import { useSearchFriendResultsViewModel } from "../../../hooks/view-model";
import FriendResultItem from "../../ui/FriendResultItem";

/** 키워드가 있을 때만 마운트 — 검색 쿼리·결과·유저 행(프로필 열기) */
const FindFriendSearchSection: React.FC = () => {
  const {
    foundList,
    hasResults,
    isLoading,
    isError,
  } = useSearchFriendResultsViewModel();

  const { openProfile, onOpenProfileKeyDown } =
    useOpenProfileBySearchResultItem();

  if (hasResults) {
    return (
      <ul className="flex list-none flex-col gap-2 px-4">
        {foundList?.map(({ user, friendRequestInfo }) => (
          <li
            key={user.userId + "friends-box"}
            className="rounded-md px-2 py-1 hover:bg-grey-100"
          >
            <FriendResultItem
              user={user}
              friendRequestInfo={friendRequestInfo}
              onOpenProfile={openProfile}
              onKeyDown={onOpenProfileKeyDown}
            />
          </li>
        ))}
      </ul>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[12rem] flex-grow flex-col items-center justify-center px-4">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[12rem] flex-col items-center justify-center px-4 py-4">
        <p className="text-center text-sm text-red-500">
          검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center px-4 py-4">
      <p className="text-center text-sm text-grey-500">
        검색 결과가 없습니다.
      </p>
    </div>
  );
};

export default FindFriendSearchSection;
