"use client";

import React from "react";

import type { User } from "@/features/user";

import { cn } from "@/shared/lib";

import { ProfileAcceptIncomingButton } from "./ProfileAcceptIncomingButton";
import { ProfileOpenChatButton } from "./ProfileOpenChatButton";
import { ProfileSendFriendRequestButton } from "./ProfileSendFriendRequestButton";

import type { UserProfileRelationship } from "@/features/user/store";

export function ProfileRelationshipFooter({
  relationship,
  user,
}: {
  relationship: UserProfileRelationship;
  user: User;
}) {
  if (relationship === "friend") {
    return <ProfileOpenChatButton username={user.username} />;
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
    return <ProfileAcceptIncomingButton />;
  }

  return <ProfileSendFriendRequestButton user={user} />;
}
