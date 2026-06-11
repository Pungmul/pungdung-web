"use client";

import React from "react";

import { useSendFriendRequestAction } from "@/features/friends";
import type { User } from "@/features/user";

import { Button } from "@/shared/components";

export function ProfileSendFriendRequestButton({ user }: { user: User }) {
  const { handleRequestFriend, isPending } = useSendFriendRequestAction();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => void handleRequestFriend(user)}
      className="rounded-xl bg-primary py-3 text-base font-bold leading-normal text-background disabled:bg-grey-200"
    >
      {isPending ? "요청 중…" : "친구 신청"}
    </Button>
  );
}
