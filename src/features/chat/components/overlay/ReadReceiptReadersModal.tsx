"use client";

import type { User } from "@/features/user";

import { Modal } from "@/shared/components";

import { ChatMemberItem } from "../ui/ChatMemberItem";

type ReadReceiptReadersModalProps = {
  isOpen: boolean;
  readers: readonly User[];
  currentUsername: string;
  onClose: () => void;
  onMemberProfileClick: (user: User) => void;
};

export function ReadReceiptReadersModal({
  isOpen,
  readers,
  currentUsername,
  onClose,
  onMemberProfileClick,
}: ReadReceiptReadersModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="읽은 사람"
      className="w-full max-w-[360px] p-0"
      headerClassName="px-4"
    >
      <section className="flex flex-col py-[8px]">
        <ul className="flex flex-col">
          {readers.map((user) => (
            <li key={user.username}>
              <ChatMemberItem
                user={user}
                isCurrentUser={currentUsername === user.username}
                onProfileClick={onMemberProfileClick}
              />
            </li>
          ))}
        </ul>
      </section>
    </Modal>
  );
}
