"use client";

import { useQuery } from "@tanstack/react-query";

import dayjs from "dayjs";

import { Modal, SkeletonView } from "@/shared";

import { InvitationCodeCopyBox } from "../ui/InvitationCodeCopyBox";

import "dayjs/locale/ko";
import { myPageQueries } from "@/features/my-page/queries";

type MyInvitationCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MyInvitationCodeModal({
  isOpen,
  onClose,
}: MyInvitationCodeModalProps) {
  const {
    data: invitationCode,
    isError,
    isPending,
    refetch,
  } = useQuery({
    ...myPageQueries.invitationCode(),
    enabled: isOpen,
  });
  const resetDate = invitationCode ? dayjs(invitationCode.nextResetAt) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="내 초대코드 확인"
      className="w-[calc(100%-32px)] max-w-[360px]"
    >
      <div className="flex flex-col gap-5 px-2 py-5">
        {isPending && (
          <div className="flex flex-col gap-4">
            <SkeletonView className="h-[56px] w-full rounded-md" />
            <SkeletonView className="h-[20px] w-[160px] rounded" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-grey-600">
              초대코드를 불러오지 못했습니다.
            </p>
            <button
              type="button"
              className="self-start rounded-md bg-grey-800 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                void refetch();
              }}
            >
              다시 시도
            </button>
          </div>
        )}

        {invitationCode && (
          <>
            <InvitationCodeCopyBox code={invitationCode.code} />
            <p className="px-0.5 text-[15px] font-medium text-grey-700">
              <span className="font-semibold text-primary">
                {invitationCode.remainingUses}
              </span>
              <span className="font-semibold text-grey-600">/{invitationCode.maxUses}</span>
              {resetDate?.isValid() && (
                <span className="text-grey-400">
                  {" · "}{resetDate.locale("ko").format("M월 D일(dd) 초기화")}
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
