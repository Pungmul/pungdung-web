"use client";

import React from "react";

import { cn } from "@/shared/lib";

import { ProfileAcceptIncomingButton } from "./ProfileAcceptIncomingButton";
import { ProfileOpenChatButton } from "./ProfileOpenChatButton";
import { ProfileSendFriendRequestButton } from "./ProfileSendFriendRequestButton";
import type { User } from "../../types/user.types";
import type { UserProfileRelationship } from "../../types/user-profile-modal.types";

export function ProfileRelationshipFooter({
  relationship,
  user,
  incomingFriendRequestId,
  close,
}: {
  relationship: UserProfileRelationship;
  user: User;
  incomingFriendRequestId: number | null;
  close: () => void;
}) {
  if (relationship === "friend") {
    return <ProfileOpenChatButton username={user.username} onBeforeNavigate={close} />;
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
      <ProfileAcceptIncomingButton
        incomingFriendRequestId={incomingFriendRequestId}
      />
    );
  }

  return <ProfileSendFriendRequestButton user={user} />;
}
