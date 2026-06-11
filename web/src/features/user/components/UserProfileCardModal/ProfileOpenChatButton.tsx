"use client";

import React from "react";

import { useOpenPersonalChatNavigation } from "@/features/chat";

import { Button } from "@/shared/components";

type ProfileOpenChatButtonProps = {
  username: string;
  onBeforeNavigate?: () => void;
};

export function ProfileOpenChatButton({
  username,
  onBeforeNavigate,
}: ProfileOpenChatButtonProps) {
  const { openPersonalChat, isPending } = useOpenPersonalChatNavigation();
  const handleClick = () => {
    if (onBeforeNavigate) {
      void openPersonalChat(username, { onBeforeNavigate });
      return;
    }
    void openPersonalChat(username);
  };

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="rounded-xl bg-primary py-3 text-base font-bold leading-normal tracking-wide text-background disabled:bg-grey-200"
    >
      {isPending ? "이동 중…" : "1:1 채팅"}
    </Button>
  );
}
