"use client";

import { useMemo, useState } from "react";

import { deriveFriendsPageTabCounts } from "../../services";
import type { FriendsLoadData, FriendsPageProfileTab } from "../../types";

/** 친구 관리 페이지 상단 탭: 선택 상태 + `lists` 기준 탭별 건수 */
export function useFriendPageTabViewModel(lists: FriendsLoadData) {
  const [tab, setTab] = useState<FriendsPageProfileTab>("friends");

  const tabCounts = useMemo(
    () => deriveFriendsPageTabCounts(lists),
    [lists]
  );

  return { tab, setTab, tabCounts };
}
