"use client";

import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { CameraIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

import {
  chatQueries,
  useChatNotificationSettingAction,
  useChatRoomDisplayOverride,
} from "@/features/chat";

import { Header, Input } from "@/shared";
import { Toggle } from "@/shared/components/form/Toggle";

type ChatRoomSettingScreenProps = {
  roomId: string;
  defaultRoomName: string;
  defaultProfileImageUrl: string | null;
  onBack: () => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to read image file."));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ChatRoomSettingScreen({
  roomId,
  defaultRoomName,
  defaultProfileImageUrl,
  onBack,
}: ChatRoomSettingScreenProps) {
  const { override, updateProfileImageUrl, updateRoomName } =
    useChatRoomDisplayOverride(roomId);
  const [roomNameDraft, setRoomNameDraft] = useState("");

  const { updateRoomNotification, isUpdatingRoomNotification } =
    useChatNotificationSettingAction();

  const { data: roomList = [] } = useQuery({
    ...chatQueries.roomList(),
    enabled: false,
  });
  const roomFromList = roomList.find((room) => room.chatRoomUUID === roomId);

  const { data: roomNotificationFallback } = useQuery({
    ...chatQueries.roomNotification(roomId),
    enabled: !!roomId && !roomFromList,
  });

  const isMuted = useMemo(() => {
    if (roomFromList) return roomFromList.isMuted;
    return roomNotificationFallback?.isMuted ?? false;
  }, [roomFromList, roomNotificationFallback?.isMuted]);

  const profileImageSrc =
    override?.profileImageUrl !== undefined
      ? override.profileImageUrl
      : defaultProfileImageUrl;
  const hasRoomNameDraft = roomNameDraft.trim().length > 0;

  useEffect(() => {
    setRoomNameDraft(override?.roomName ?? "");
  }, [override?.roomName]);

  const handleRoomNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      setRoomNameDraft(nextValue);
      void updateRoomName(
        nextValue.trim().length > 0 ? nextValue : undefined
      );
    },
    [updateRoomName]
  );

  const handleClearRoomName = useCallback(() => {
    setRoomNameDraft("");
    void updateRoomName(undefined);
  }, [updateRoomName]);

  const handleProfileImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const dataUrl = await readFileAsDataUrl(file);
      await updateProfileImageUrl(dataUrl);
      e.target.value = "";
    },
    [updateProfileImageUrl]
  );

  const handleResetProfileImage = useCallback(() => {
    void updateProfileImageUrl(undefined);
  }, [updateProfileImageUrl]);

  const handleToggleNotification = useCallback(
    async (nextChecked: boolean) => {
      if (isUpdatingRoomNotification) return;
      await updateRoomNotification(roomId, !nextChecked);
    },
    [isUpdatingRoomNotification, roomId, updateRoomNotification]
  );

  return (
    <div className="h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] bg-background">
      <Header title="채팅방 설정" onLeftClick={onBack} />
      <div className="min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col items-center gap-3">
            <div className="relative">
              <label
                htmlFor="chat-room-profile-image"
                className="absolute -bottom-1 -right-1 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-grey-800"
              >
                <span className="flex size-6 items-center justify-center">
                  <CameraIcon className="size-full text-background" />
                </span>
                <input
                  id="chat-room-profile-image"
                  name="chat-room-profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>
              <div className="relative size-36 overflow-hidden rounded-md border-2 border-grey-300 bg-grey-200">
                {!!profileImageSrc && (
                  <Image
                    src={profileImageSrc}
                    alt="채팅방 프로필 이미지"
                    fill
                    className="object-cover object-center rounded-sm"
                  />
                )}
              </div>
            </div>
            {override?.profileImageUrl !== undefined && (
              <button
                type="button"
                className="text-sm text-grey-600 underline underline-offset-2"
                onClick={handleResetProfileImage}
              >
                기본 이미지로 되돌리기
              </button>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-medium text-grey-700">
              채팅방 이름
            </label>
            <Input
              value={roomNameDraft}
              placeholder={defaultRoomName}
              onChange={handleRoomNameChange}
              trailingComponent={
                hasRoomNameDraft ? (
                  <button
                    type="button"
                    className="flex items-center justify-center rounded p-0.5 text-grey-500 hover:text-grey-700"
                    onClick={handleClearRoomName}
                    aria-label="채팅방 이름 지우기"
                  >
                    <span className="flex size-6 items-center justify-center p-0.5">
                      <XCircleIcon className="size-full" />
                    </span>
                  </button>
                ) : null
              }
            />
            <span className="text-sm text-grey-500 p-0.5">
              변경된 채팅방 이름과 프로필은 나에게만 적용돼요.
            </span>
          </section>

          <section className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-grey-800">
                채팅방 알림
              </h2>
              <p className="text-sm text-grey-500">
                이 채팅방의 메시지 알림을 설정합니다.
              </p>
            </div>
            <div
              className={
                isUpdatingRoomNotification
                  ? "pointer-events-none opacity-70"
                  : undefined
              }
              aria-busy={isUpdatingRoomNotification}
            >
              <Toggle
                checked={!isMuted}
                toggle={handleToggleNotification}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
