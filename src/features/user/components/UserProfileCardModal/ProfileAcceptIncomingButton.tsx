"use client";

import React from "react";

import { useAcceptFriendRequestAction } from "@/features/friends";

import { Button } from "@/shared/components";

import { userProfileModalStore } from "@/features/user/store";

export function ProfileAcceptIncomingButton() {
  const incomingFriendRequestId = userProfileModalStore(
    (s) => s.incomingFriendRequestId
  );
  const { handleReceiveFriend, isPending } = useAcceptFriendRequestAction();
  const disabled = isPending || incomingFriendRequestId == null;

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (incomingFriendRequestId == null) return;
        void handleReceiveFriend(incomingFriendRequestId);
      }}
      className="rounded-xl bg-primary py-3 text-base font-bold leading-normal text-background disabled:bg-grey-200"
    >
      {isPending ? "처리 중…" : "수락"}
    </Button>
  );
}
