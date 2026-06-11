"use client";

import Link from "next/link";

import { ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  FRIENDS_PAGE_TAB_ITEMS,
  FriendsAcceptedSection,
  FriendsReceivedSection,
  FriendsSentSection,
  useFriendPageTabViewModel,
  useLoadFriendListsViewModel,
} from "@/features/friends";
import { UserProfileCardModalHost } from "@/features/user";

import {
  cn,
  Header,
  Space,
  Spinner,
} from "@/shared";

export default function FriendsPage() {
  const { lists, showInitialSpinner, isError, refetch } =
    useLoadFriendListsViewModel();

  const { tab, setTab, tabCounts } = useFriendPageTabViewModel(lists);

  const { acceptedFriendList, pendingReceivedList, pendingSentList } = lists;

  return (
    <div className="h-full w-full bg-grey-100 ">
      <UserProfileCardModalHost />
      <div className="relative mx-auto flex h-full w-full min-w-[360px] max-w-[768px] flex-col bg-background">
        <Header title="친구 관리" />
        <Space h={16} />
        <Link
          href="/my-page/friends/find"
          className="relative mx-6 flex h-12 flex-row items-center rounded-xl bg-grey-200 py-3 pl-12 pr-6"
        >
          <MagnifyingGlassIcon className="absolute left-4 size-[18px] text-grey-500" />
          <span className="text-base text-grey-500">친구 검색</span>
          <span className="ml-auto size-4 flex items-center justify-center">
            <ChevronRightIcon className="size-full text-grey-500" />
          </span>
        </Link>
        <Space h={16} />

        <div className="sticky top-0 z-10 bg-grey-100/85 px-6 pb-2 pt-1 backdrop-blur-sm">
          <div className="flex w-full flex-row items-stretch gap-1.5">
            {FRIENDS_PAGE_TAB_ITEMS.map(({ id, label }) => {
              const active = tab === id;
              const count = tabCounts[id];
              return (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex min-w-0 flex-1 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "text-grey-700 hover:bg-grey-100 hover:text-grey-800"
                  )}
                  onClick={() => setTab(id)}
                >
                  <span>{label}</span>
                  {count > 0 ? (
                    <span
                      className={cn(
                        "tabular-nums text-xs font-semibold",
                        active ? "text-white/90" : "text-primary"
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex flex-grow flex-col bg-background px-6 pb-24 pt-4">
          {showInitialSpinner ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
              <Spinner />
              <p className="text-sm text-grey-500">친구 목록 불러오는 중…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 py-16">
              <p className="text-center text-sm text-grey-600">
                친구 목록을 불러오지 못했습니다.
              </p>
              <button
                type="button"
                className="rounded-md bg-red-500 px-4 py-2 text-[12px] font-medium text-white hover:bg-red-600"
                onClick={() => refetch()}
              >
                다시 시도
              </button>
            </div>
          ) : tab === "friends" ? (
            <FriendsAcceptedSection acceptedFriendList={acceptedFriendList} />
          ) : tab === "sent" ? (
            <FriendsSentSection pendingSentList={pendingSentList} />
          ) : (
            <FriendsReceivedSection pendingReceivedList={pendingReceivedList} />
          )}
        </main>
      </div>
    </div>
  );
}
