import { lazy } from "react";

import { Suspense } from "@suspensive/react";

import { ChatIconOutline } from "@/shared/components/Icons";

// 동적 렌더링 강제 - 프리렌더 에러 해결
export const dynamic = "force-dynamic";
const AddChatRoomButton = lazy(() => import("@/features/chat").then((m) => ({ default: m.AddChatRoomButton })));

function InboxContent() {
  return (
    <div className="flex flex-col flex-grow h-full w-full justify-center items-center">
      <div className="flex flex-col items-center gap-[24px]">
        <span className="size-16 p-2 flex items-center justify-center">
          <ChatIconOutline className="size-full" />
        </span>
        <div className="text-[24px] font-semibold text-grey-800">
          채팅을 선택해서 대화를 시작해보세요
        </div>
        <Suspense fallback={<div>로딩 중...</div>}>
          <AddChatRoomButton />
        </Suspense>
      </div>
    </div>
  );
}

export default InboxContent;