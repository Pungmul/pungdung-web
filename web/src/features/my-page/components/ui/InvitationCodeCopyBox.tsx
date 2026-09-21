"use client";

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { Toast } from "@/shared";

type InvitationCodeCopyBoxProps = {
  code: string;
};

export function InvitationCodeCopyBox({ code }: InvitationCodeCopyBoxProps) {
  const handleCopy = async () => {
    try {
      const invitationUrl = new URL("/invite", window.location.origin);
      invitationUrl.searchParams.set("inviteCode", code);
      await navigator.clipboard.writeText(invitationUrl.toString());
      Toast.show({ message: "초대 링크가 복사되었습니다." });
    } catch {
      Toast.show({
        message: "초대 링크 복사에 실패했습니다.",
        type: "error",
      });
    }
  };

  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-3 rounded-md bg-grey-100 px-4 py-3 text-left transition-colors hover:bg-grey-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-500"
      onClick={handleCopy}
      aria-label={`초대 링크 복사 (${code})`}
    >
      <span className="font-mono text-[24px] font-semibold tracking-[0.16em] text-grey-800">
        {code}
      </span>
      <ClipboardDocumentIcon className="size-5 flex-shrink-0 text-grey-500" />
    </button>
  );
}
