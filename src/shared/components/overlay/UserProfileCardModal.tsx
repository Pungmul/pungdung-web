"use client";

import React, { memo, useEffect } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import {
  fetchUserProfileCardDetailByUsername,
  type User,
} from "@/features/user";

import { Button } from "@/shared/components";
import { cn } from "@/shared/lib";
import type { UserProfileRelationship } from "@/shared/store/userProfileModal.store";

import { UserProfileKebabMenu } from "./UserProfileKebabMenu";

function formatDetailCell(
  isPending: boolean,
  value: string | number | undefined | null
): string {
  if (isPending) return "…";
  if (value === "" || value == null) return "—";
  return String(value);
}

function formatSchoolClubLine(
  isPending: boolean,
  school: string | undefined,
  groupName: string | undefined
): string {
  if (isPending) return "…";
  const parts = [school, groupName].filter(
    (s) => s != null && String(s).trim() !== ""
  );
  if (parts.length === 0) return "—";
  return parts.join(" · ");
}

export type UserProfileCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  relationship: UserProfileRelationship;
  onRequestFriend: () => void;
  onAcceptIncomingRequest?: () => void;
  onOpenPersonalChat: () => void;
  /** 본인 프로필(`relationship === "self"`)일 때 내 정보 수정 화면으로 이동 */
  onOpenEditProfile?: () => void;
  onReport: () => void;
  onBlock: () => void;
  isRequestPending?: boolean;
  isAcceptPending?: boolean;
  isChatPending?: boolean;
};

function UserProfileCardModalImpl({
  isOpen,
  onClose,
  user,
  relationship,
  onRequestFriend,
  onAcceptIncomingRequest,
  onOpenPersonalChat,
  onOpenEditProfile,
  onReport,
  onBlock,
  isRequestPending,
  isAcceptPending,
  isChatPending,
}: UserProfileCardModalProps) {
  const { data: detail, isPending, isError } = useQuery({
    queryKey: ["users", "profile-info", user.username],
    queryFn: async () => {
      const res = await fetchUserProfileCardDetailByUsername(user.username);
      if (res == null) {
        throw new Error("USER_PROFILE_DETAIL_FETCH_FAILED");
      }
      return res;
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const loadingDetail = isPending && !isError;

  const profileSrc =
    detail?.profileImage?.fullFilePath ?? user.profileImage?.fullFilePath;

  const displayName = user.name;
  const nicknameLine = formatDetailCell(loadingDetail, detail?.clubName);
  const schoolClubLine = formatSchoolClubLine(
    loadingDetail,
    detail?.school,
    detail?.groupName
  );
  const emailLine = formatDetailCell(loadingDetail, detail?.email);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const avatarInitial =
    Array.from((displayName || user.username).trim() || "?")[0] ?? "?";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label="사용자 프로필"
        className="relative mx-4 flex w-full max-w-[400px] flex-col rounded-2xl bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {relationship !== "self" ? (
          <div className="absolute right-3 top-3 z-10 flex items-center">
            <UserProfileKebabMenu onReport={onReport} onBlock={onBlock} />
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-col items-center px-6 pb-8",
            relationship === "self" ? "pt-8" : "pt-12",
          )}
        >
          <div className="relative size-[200px] shrink-0 overflow-hidden rounded-xl bg-grey-200">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt={
                  detail?.profileImage?.originalFilename ??
                  user.profileImage?.originalFilename ??
                  user.name
                }
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <span
                className="flex size-full items-center justify-center text-4xl font-medium text-grey-400 select-none"
                aria-hidden
              >
                {avatarInitial}
              </span>
            )}
          </div>

          <div className="mt-6 flex w-full flex-col items-center gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-base font-normal text-grey-800">
                {displayName}
              </p>
              <p className="text-xs text-grey-500">{nicknameLine}</p>
            </div>
            <p className="text-sm text-grey-500">{schoolClubLine}</p>
            <p className="break-all text-sm text-grey-500">{emailLine}</p>
            {isError ? (
              <p className="text-xs text-grey-400">
                상세 정보를 불러오지 못했습니다.
              </p>
            ) : null}
          </div>

          {relationship === "self" ? (
            <div className="mt-9 w-full max-w-[368px]">
              <button
                type="button"
                onClick={() => onOpenEditProfile?.()}
                className={cn(
                  "flex w-full min-h-[48px] cursor-pointer items-center justify-center rounded-xl border border-grey-500 bg-transparent px-4 py-3 text-base font-bold leading-normal text-grey-500",
                  "hover:bg-grey-100 active:bg-grey-200",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                내 정보 변경
              </button>
            </div>
          ) : (
            <div className="mt-9 w-full max-w-[368px]">
              <ProfileFooterAction
                relationship={relationship}
                onRequestFriend={onRequestFriend}
                onAcceptIncomingRequest={onAcceptIncomingRequest ?? (() => { })}
                onOpenPersonalChat={onOpenPersonalChat}
                isRequestPending={isRequestPending ?? false}
                isAcceptPending={isAcceptPending ?? false}
                isChatPending={isChatPending ?? false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileFooterAction({
  relationship,
  onRequestFriend,
  onAcceptIncomingRequest,
  onOpenPersonalChat,
  isRequestPending,
  isAcceptPending,
  isChatPending,
}: Pick<
  UserProfileCardModalProps,
  | "relationship"
  | "onRequestFriend"
  | "onAcceptIncomingRequest"
  | "onOpenPersonalChat"
  | "isRequestPending"
  | "isAcceptPending"
  | "isChatPending"
>) {
  if (relationship === "friend") {
    return (
      <Button
        type="button"
        disabled={isChatPending}
        onClick={onOpenPersonalChat}
        className="rounded-xl bg-primary py-3 text-base font-bold leading-normal tracking-wide text-background disabled:bg-grey-200"
      >
        {isChatPending ? "이동 중…" : "1:1 채팅"}
      </Button>
    );
  }

  if (relationship === "pending_out") {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "flex h-12 w-full cursor-default items-center justify-center rounded-xl border border-grey-300 bg-grey-100 text-sm text-grey-500"
        )}
      >
        친구 수락 대기중
      </button>
    );
  }

  if (relationship === "pending_in") {
    return (
      <Button
        type="button"
        disabled={isAcceptPending}
        onClick={() => onAcceptIncomingRequest?.()}
        className="rounded-xl bg-primary py-3 text-base font-bold leading-normal text-background disabled:bg-grey-200"
      >
        {isAcceptPending ? "처리 중…" : "수락"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      disabled={isRequestPending}
      onClick={onRequestFriend}
      className="rounded-xl bg-primary py-3 text-base font-bold leading-normal text-background disabled:bg-grey-200"
    >
      {isRequestPending ? "요청 중…" : "친구 신청"}
    </Button>
  );
}

export const UserProfileCardModal = memo(UserProfileCardModalImpl);
