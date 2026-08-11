"use client";

import { type MouseEvent, useCallback, useRef, useState } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { useLoginRequiredConfirmAction } from "@/features/auth";

import { useClickOutside } from "@/shared/hooks";
import { Toast } from "@/shared/store";

import { useDeletePromotionFormAction } from "../../../hooks/actions";

type PromotionMenuProps = {
  isWriter: boolean;
  isGuest?: boolean;
  formId?: number | null;
  publicKey?: string | null;
};

export function PromotionMenu({
  isWriter,
  isGuest = false,
  formId,
  publicKey,
}: PromotionMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { requestLogin } = useLoginRequiredConfirmAction();
  const { requestDeleteForm } = useDeletePromotionFormAction();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: close,
  });

  const handleReportClick = useCallback(() => {
    if (isGuest) {
      requestLogin();
      close();
      return;
    }

    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "warning",
    });
    close();
  }, [close, isGuest, requestLogin]);

  const handleDeleteClick = useCallback(() => {
    if (formId == null) return;

    close();
    requestDeleteForm({
      formId,
      publicKey: publicKey ?? null,
      confirmTitle: "공연 삭제",
      confirmMessage: "게시한 공연을 삭제할까요?",
    });
  }, [close, formId, publicKey, requestDeleteForm]);

  const handlePanelClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex size-8 p-0.5 items-center justify-center"
        aria-label="더보기"
        onClick={toggleOpen}
      >
        <EllipsisVerticalIcon className="size-full" />
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 top-full z-10 mt-2 flex flex-col gap-2 rounded-sm border border-grey-300 bg-background px-3 py-2"
          onClick={handlePanelClick}
        >
          {isWriter && formId != null ? (
            <li
              className="w-12 cursor-pointer text-right text-red-400"
              onClick={handleDeleteClick}
            >
              삭제
            </li>
          ) : null}
          {!isWriter ? (
            <li
              className="w-12 cursor-pointer text-right"
              onClick={handleReportClick}
            >
              신고
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
