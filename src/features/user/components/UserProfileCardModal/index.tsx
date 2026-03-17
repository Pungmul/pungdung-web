"use client";

import React, { memo } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib";

import { ProfileRelationshipFooter } from "./ProfileRelationshipFooter";
import { SelfProfileEditButton } from "./SelfProfileEditButton";
import { UserProfileKebabMenu } from "./UserProfileKebabMenu";
import { useUserProfileCardModalScreen } from "../../hooks/view-model/useUserProfileCardModalScreen";

function UserProfileCardModalImpl() {
  const screen = useUserProfileCardModalScreen();

  if (!screen.isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={screen.close}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label="사용자 프로필"
        className="relative mx-4 flex w-full max-w-[400px] flex-col rounded-2xl bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {screen.relationship !== "self" ? (
          <div className="absolute right-3 top-3 z-10 flex items-center">
            <UserProfileKebabMenu />
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-col items-center px-6 pb-8",
            screen.relationship === "self" ? "pt-8" : "pt-12",
          )}
        >
          <div className="relative size-[200px] shrink-0 overflow-hidden rounded-xl bg-grey-200">
            {screen.profileSrc ? (
              <Image
                src={screen.profileSrc}
                alt={screen.profileAlt}
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <span
                className="flex size-full items-center justify-center text-4xl font-medium text-grey-400 select-none"
                aria-hidden
              >
                {screen.avatarInitial}
              </span>
            )}
          </div>

          <div className="mt-6 flex w-full flex-col items-center gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-base font-normal text-grey-800">
                {screen.displayName}
              </p>
              <p className="text-xs text-grey-500">{screen.nicknameLine}</p>
            </div>
            <p className="text-sm text-grey-500">{screen.schoolClubLine}</p>
            <p className="break-all text-sm text-grey-500">{screen.emailLine}</p>
            {screen.isError ? (
              <p className="text-xs text-grey-400">
                상세 정보를 불러오지 못했습니다.
              </p>
            ) : null}
          </div>

          {screen.relationship === "self" ? (
            <div className="mt-9 w-full max-w-[368px]">
              <SelfProfileEditButton close={screen.close} />
            </div>
          ) : (
            <div className="mt-9 w-full max-w-[368px]">
              {/* leaf 버튼에서 store를 직접 읽지 않도록 필요한 상태를 상위에서 주입한다. */}
              <ProfileRelationshipFooter
                relationship={screen.relationship}
                user={screen.user}
                incomingFriendRequestId={screen.incomingFriendRequestId}
                close={screen.close}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const UserProfileCardModal = memo(UserProfileCardModalImpl);
