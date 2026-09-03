"use client";

import type { CSSProperties } from "react";

import Modal from "./Modal";

export function AlertDialog({
  isOpen,
  title,
  message,
  subMessage = "",
  type = "alert",
  confirmText = "확인",
  cancelText = "취소",
  confirmColor,
  onConfirm,
  onCancel,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  type?: "alert" | "confirm";
  confirmText?: string | undefined;
  cancelText?: string | undefined;
  confirmColor?: CSSProperties["color"] | undefined;
  onConfirm?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasHeader={false}
      className="rounded-[16px] overflow-hidden p-0 md:min-w-96"
    >
      <div className="flex flex-col rounded-md overflow-hidden gap-[12px] px-[24px] py-[24px]">
        <div className="text-lg text-center font-semibold md:text-xl">{title}</div>
        <div className="text-base text-center px-[2px]">{message}</div>
        {subMessage.trim() !== "" && (
          <div className="text-sm text-center px-[2px] text-grey-400">
            {subMessage}
          </div>
        )}
      </div>
      {type === "confirm" ? (
        <div className="flex flex-row justify-center w-full border-t border-t-grey-300 text-sm md:text-base">
          <button
            onClick={onCancel}
            className="text-grey-600 px-4 py-3 shrink-0 flex-grow border-r-grey-300 border-r-[0.5px]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="text-grey-800 px-4 py-3 shrink-0 flex-grow border-l-grey-300 border-l-[0.5px]"
            style={{
              color: confirmColor,
            }}
          >
            {confirmText}
          </button>
        </div>
      ) : (
        <button
          onClick={onConfirm}
          className="flex justify-center w-full bg-background py-[12px] text-grey-800 border-t border-t-grey-300"
        >
          {confirmText}
        </button>
      )}
    </Modal>
  );
}
