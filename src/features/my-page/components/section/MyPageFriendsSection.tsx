"use client";

import Link from "next/link";

import { SkeletonView } from "@/shared";

import { useFriendsSectionSummary } from "@/features/my-page/hooks/view-model";
import { getMyPageFriendsTrailingContentState } from "@/features/my-page/lib/get-my-page-friends-trailing-content-state";

export function MyPageFriendsSection() {
  const {
    acceptedCount,
    pendingReceivedCount,
    showSkeleton,
    isError,
  } = useFriendsSectionSummary();

  const trailingState = getMyPageFriendsTrailingContentState({
    showSkeleton,
    isError,
    pendingReceivedCount,
  });

  // 중첩 삼항 대신 상태 머신 형태 분기로 읽기 흐름을 고정한다.
  const renderTrailingContent = () => {
    switch (trailingState.kind) {
      case "skeleton":
        return <SkeletonView className="h-[20px] w-[120px] md:w-[160px] rounded" />;
      case "error":
        return <span className="text-grey-400 text-[14px] shrink-0">오류</span>;
      case "pending-request":
        return (
          <p className="text-blue-400 text-[14px] shrink-0">
            {trailingState.pendingReceivedCount} 개의 새로운 친구 요청
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      href="/my-page/friends"
      className="text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800 flex flex-row items-center justify-between gap-[8px]"
    >
      <span className="flex min-w-0 flex-row items-center gap-2">
        <span className="truncate">친구 관리</span>
        {!showSkeleton && !isError ? (
          <span className="text-grey-400 font-normal tabular-nums shrink-0">
            {acceptedCount}
          </span>
        ) : null}
      </span>
      {renderTrailingContent()}
    </Link>
  );
}
