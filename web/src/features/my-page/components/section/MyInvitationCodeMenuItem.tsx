"use client";

import { useState } from "react";

import { MyInvitationCodeModal } from "../overlay/MyInvitationCodeModal";

export function MyInvitationCodeMenuItem() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="block w-full p-[8px] text-left text-[16px] font-semibold text-grey-600 hover:text-grey-800"
        onClick={() => setIsOpen(true)}
      >
        내 초대코드 확인
      </button>
      <MyInvitationCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
