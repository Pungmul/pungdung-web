"use client";

import React, { memo, useEffect, useMemo } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { cn } from "@/shared/lib";

import {
  formatDetailCell,
  formatSchoolClubLine,
} from "./format-profile-detail";
import { normalizeUserForProfileModal } from "./normalize-user-for-profile-modal";
import { ProfileRelationshipFooter } from "./ProfileRelationshipFooter";
import { SelfProfileEditButton } from "./SelfProfileEditButton";
import { UserProfileKebabMenu } from "./UserProfileKebabMenu";

import { fetchUserProfileCardDetailByUsername } from "@/features/user/api/client";
import { userProfileModalStore } from "@/features/user/store";

function UserProfileCardModalImpl() {
  const isOpen = userProfileModalStore((s) => s.isOpen);
  const rawUser = userProfileModalStore((s) => s.user);
  const relationship = userProfileModalStore((s) => s.relationship);
  const onClose = userProfileModalStore((s) => s.close);

  const user = useMemo(
    () => (rawUser ? normalizeUserForProfileModal(rawUser) : null),
    [rawUser],
  );

  const { data: detail, isPending, isError } = useQuery({
    queryKey: ["users", "profile-info", user?.username ?? ""],
    queryFn: async () => {
      const res = await fetchUserProfileCardDetailByUsername(user!.username);
      if (res == null) {
        throw new Error("USER_PROFILE_DETAIL_FETCH_FAILED");
      }
      return res;
    },
    enabled: isOpen && user != null,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const loadingDetail = isPending && !isError;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || user == null) return null;

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
            <UserProfileKebabMenu />
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
              <p className="text-base font-normal text-grey-800">{displayName}</p>
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
              <SelfProfileEditButton />
            </div>
          ) : (
            <div className="mt-9 w-full max-w-[368px]">
              <ProfileRelationshipFooter relationship={relationship} user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const UserProfileCardModal = memo(UserProfileCardModalImpl);
