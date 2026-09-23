import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function ChatPerformanceChatNotice() {
  return (
    <div className="p-3">
      <div className="flex items-center gap-1 rounded-sm bg-grey-100 px-2 py-1.5">
        <InformationCircleIcon
          className="size-4 shrink-0 text-grey-400"
          strokeWidth={2.25}
          aria-hidden
        />
        <p className="pt-0.5 text-[13px] leading-[20px] text-grey-600">
          공연과 관계 없는 채팅은 제재 대상이 될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
