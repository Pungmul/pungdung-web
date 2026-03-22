import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { BellIcon, BellSlashIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";

import { useChatNotificationSettingAction } from "../../hooks/actions";
import { chatQueries } from "../../queries";

interface ChatSettingsButtonProps {
  roomId: string;
  onClick?: () => void;
}

export const ChatSettingsButton = ({ roomId, onClick }: ChatSettingsButtonProps) => {
  const { updateRoomNotification, isUpdatingRoomNotification } =
    useChatNotificationSettingAction();

  const { data: roomList = [] } = useQuery({
    ...chatQueries.roomList(),
    enabled: false,
  });
  const roomFromList = roomList?.find((room) => room.chatRoomUUID === roomId);

  const shouldFetchRoomNotificationFallback = !!roomId && !roomFromList;
  const { data: roomNotificationFallback } = useQuery({
    ...chatQueries.roomNotification(roomId),
    enabled: shouldFetchRoomNotificationFallback,
  });

  const isMuted = useMemo(() => {
    if (roomFromList) return roomFromList.isMuted;
    return roomNotificationFallback?.isMuted ?? false;
  }, [roomFromList, roomNotificationFallback?.isMuted]);

  const handleToggleMute = async () => {
    if (!roomId || isUpdatingRoomNotification) return;
    await updateRoomNotification(roomId, !isMuted);
  };

  return (
    <div className="flex flex-row justify-end items-center gap-[16px] py-[8px] px-[16px]">
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center disabled:cursor-not-allowed"
        onClick={handleToggleMute}
        disabled={isUpdatingRoomNotification}
        aria-label={isMuted ? "채팅방 알림 켜기" : "채팅방 알림 끄기"}
      >
        <span className="flex size-6 items-center justify-center">
          {isMuted ? (
            <BellSlashIcon className="size-full text-grey-500" />
          ) : (
            <BellIcon className="size-full text-grey-500" />
          )}
        </span>
      </button>
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center"
        onClick={onClick}
      >
        <span className="flex size-6 items-center justify-center">
          <Cog8ToothIcon className="size-full text-grey-500" />
        </span>
      </button>
    </div>
  );
};
