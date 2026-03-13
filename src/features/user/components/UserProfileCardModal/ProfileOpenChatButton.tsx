"use client";

import React from "react";

import { useOpenPersonalChatNavigation } from "@/features/chat";

import { Button } from "@/shared/components";

import { userProfileModalStore } from "@/features/user/store";

export function ProfileOpenChatButton({ username }: { username: string }) {
  const close = userProfileModalStore((s) => s.close);
  const { openPersonalChat, isPending } = useOpenPersonalChatNavigation();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => void openPersonalChat(username, { onBeforeNavigate: close })}
      className="rounded-xl bg-primary py-3 text-base font-bold leading-normal tracking-wide text-background disabled:bg-grey-200"
    >
      {isPending ? "이동 중…" : "1:1 채팅"}
    </Button>
  );
}
