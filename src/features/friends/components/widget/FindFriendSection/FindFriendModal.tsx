"use client";

import { Modal } from "@/shared";

import type { FindFriendShellProps } from "./types";

export function FindFriendModal({
  isOpen,
  onClose,
  children,
}: FindFriendShellProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="친구 검색"
      className="w-[min(100vw-2rem,28rem)] max-h-[min(90dvh,40rem)] p-0 overflow-hidden"
      overflow="auto"
    >
      <div className="pt-1 pb-4 px-0">{children}</div>
    </Modal>
  );
}
