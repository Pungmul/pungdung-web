"use client";

import { useView } from "@/shared/lib/view/view-store-provider";

import { FindFriendPage } from "../../find/_FindFriendPage";

/** 소프트 네비: 데스크톱은 모달, 모바일·웹뷰는 전체 화면 오버레이 (번개 build 인터셉트와 동일 계열) */
export default function InterceptedFindFriendPage() {
  const view = useView();

  const body = <FindFriendPage />;

  if (view === "desktop") {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 md:items-center md:p-4">
        <div className="flex h-[90dvh] min-h-[90dvh] max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl md:rounded-2xl">
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">{body}</div>
  );
}
