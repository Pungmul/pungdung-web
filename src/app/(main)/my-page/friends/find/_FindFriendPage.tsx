"use client";

import { FindFriendPanel } from "@/features/friends";

import { Header, UserProfileCardModalHost } from "@/shared";

/** `/my-page/friends/find` — 전체 페이지·모달 인터셉트에서 공통으로 쓰는 화면 */
export function FindFriendPage() {
  return (
    <div className="bg-grey-100 flex h-full min-h-0 w-full flex-1 flex-col">
      <UserProfileCardModalHost />
      <div className="relative mx-auto flex h-full min-h-0 w-full min-w-[360px] max-w-[768px] flex-1 flex-col bg-grey-100">
        <Header title="친구 검색" />
        <main className="bg-background min-h-0 flex-1 overflow-hidden">
          <FindFriendPanel />
        </main>
      </div>
    </div>
  );
}

export default FindFriendPage;
