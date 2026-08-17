import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Modal from "./Modal";

type ConfirmModalArgs = {
  title: string;
  hasHeader: boolean;
};

function ConfirmModal({ title, hasHeader }: ConfirmModalArgs) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        열기
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...(title ? { title } : {})}
        hasHeader={hasHeader}
      >
        <p className="py-4 text-grey-700">모달 내용입니다.</p>
      </Modal>
    </>
  );
}

const meta = {
  title: "shared/ui/Modal",
  component: ConfirmModal,
  args: {
    title: "대화상대 선택",
    hasHeader: true,
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Untitled: Story = {
  args: {
    title: "",
  },
};
