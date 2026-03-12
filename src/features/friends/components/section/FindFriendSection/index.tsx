"use client";

import React from "react";

import { SearchInput } from "@/shared";
import { Conditional } from "@/shared/components";

import FindFriendHistorySection from "./FindFriendHistorySection";
import FindFriendSearchSection from "./FindFriendSearchSection";
import {
  useApplySearchHistoryAction,
  useChangeSearchKeywordAction,
} from "../../../hooks/actions";
import { useClearFriendSearchKeywordOnUnmount } from "../../../hooks/view-model";
import { friendStore } from "../../../store";

export function FindFriendSection() {
  // 검색창 키워드만 구독 — 검색/기록 분기는 아래 Conditional에서만 조합
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const panelMode =
    searchKeyword.trim().length > 0 ? "search" : "history";

  useClearFriendSearchKeywordOnUnmount();

  // 검색창: 필터 키워드 입력만
  const { handleChange } = useChangeSearchKeywordAction();

  // 검색창 Enter: 키워드型 기록 추가(목록 선택·유저 행은 각 섹션에서 처리)
  const { handleSearchInputKeyDown } = useApplySearchHistoryAction();

  return (
    <section>
      <div className="w-full px-6 py-4">
        <SearchInput
          variant="mutedBar"
          placeholder="친구 검색"
          value={searchKeyword}
          onChange={handleChange}
          onKeyDown={(event) =>
            handleSearchInputKeyDown(event, searchKeyword)
          }
        />
      </div>
      <div className="w-full min-h-[min(24rem,55dvh)] max-h-[min(24rem,55dvh)] mt-2 overflow-y-auto overscroll-y-contain touch-pan-y">
        <Conditional
          value={panelMode}
          cases={{
            search: <FindFriendSearchSection />,
            history: <FindFriendHistorySection />,
          }}
        />
      </div>
    </section>
  );
}
