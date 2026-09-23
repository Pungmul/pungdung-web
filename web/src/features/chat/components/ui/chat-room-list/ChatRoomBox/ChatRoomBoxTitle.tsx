import { BellSlashIcon } from "@heroicons/react/24/solid";

type ChatRoomBoxTitleProps = {
  roomName: string;
  typeLabel: string | null;
  memberCount: number | null;
  isMuted: boolean;
};

export function ChatRoomBoxTitle({
  roomName,
  typeLabel,
  memberCount,
  isMuted,
}: ChatRoomBoxTitleProps) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-1 min-h-[18px] ">
      <div className="min-w-0 truncate text-[13px] font-semibold leading-[13px] pt-1">
        {roomName}
      </div>
      {typeLabel ? (
        <span className="flex items-center justify-center shrink-0 rounded bg-grey-100 px-1 py-0.5">
          <div className="vertical-center text-[12px] leading-[12px] text-grey-400 align-bottom pt-0.5">
            {typeLabel}
          </div>
        </span>
      ) : null}
      {memberCount != null ? (
        <span className="shrink-0 text-[12px] leading-[12px] pt-1 text-grey-500">{memberCount}</span>
      ) : null}
      <span className="inline-flex size-[14px] shrink-0 items-center justify-center">
        <BellSlashIcon
          className={`size-full text-grey-500 ${isMuted ? "visible" : "invisible"}`}
          aria-label={isMuted ? "알림 음소거됨" : undefined}
          aria-hidden={!isMuted}
        />
      </span>
    </div>
  );
}
