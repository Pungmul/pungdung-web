"use client";

import { useCallback, useRef } from "react";

import { ArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";

import { useIOSKeyboardOpacityFix } from "@/shared/hooks";
import { useView } from "@/shared/lib";

interface ChatSendFormProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
}

const MAX_TEXTAREA_ROWS = 4;
/** getComputedStyle 실패 시 폴백 (class: leading-[20px]와 동일) */
const TEXTAREA_LINE_HEIGHT_FALLBACK = 20;

export const ChatSendForm: React.FC<ChatSendFormProps> = ({
  onSendMessage,
  onSendImage,
}) => {
  const {
    ref: messageRef,
    applyIosKeyboardOpacityFixFocus,
    onBlur: handleTextareaBlur,
  } = useIOSKeyboardOpacityFix<HTMLTextAreaElement>({
    enabled: true,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const view = useView();

  const adjustHeight = useCallback(() => {
    const textarea = messageRef.current;
    if (!textarea) return;

    const cs = getComputedStyle(textarea);
    const lineHeightPx = parseFloat(cs.lineHeight);

    const lineHeight =
      Number.isFinite(lineHeightPx) && lineHeightPx > 0
        ? lineHeightPx
        : TEXTAREA_LINE_HEIGHT_FALLBACK;

    const maxHeight = lineHeight * MAX_TEXTAREA_ROWS;

    textarea.style.maxHeight = `${maxHeight}px`;

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [messageRef]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const textarea = messageRef.current;
    const message = textarea?.value ?? "";

    if (!message.trim()) return;

    if (textarea) {
      textarea.value = "";
      textarea.style.height = "auto";
      textarea.style.maxHeight = "";
      textarea.style.overflowY = "hidden";
    }

    await onSendMessage(message);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      onSendImage(files);
      e.target.value = "";
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (view !== "desktop") return;

      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    },
    [view]
  );

  return (
    <form
      ref={formRef}
      className="
        z-20 shrink-0 bg-background
        max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))]
        max-md:focus-within:pb-0
      "
      onSubmit={onSubmit}
    >
      <div className="items-center bg-background px-2 py-2">
        <div className="flex flex-row items-end rounded-full bg-grey-100 px-0.5 py-0.5">
          <label
            htmlFor="image-upload"
            className="flex h-9 flex-col justify-center rounded-full bg-primary px-4 text-background"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              multiple
              onChange={onImageChange}
            />
            <PhotoIcon className="size-5 text-white" />
          </label>

          <div className="min-w-0 flex-grow px-4 py-[8px]">
            <textarea
              ref={messageRef}
              name="comment"
              onTouchStart={applyIosKeyboardOpacityFixFocus}
              onBlur={handleTextareaBlur}
              onChange={adjustHeight}
              onKeyDown={handleKeyDown}
              placeholder="메시지 입력"
              className="
                block box-border min-h-[20px] w-full resize-none overflow-y-hidden
                border-none bg-transparent p-0 text-[12px] leading-[20px]
                outline-none scrollbar-thin scrollbar-track-transparent
                scrollbar-thumb-grey-300 hover:scrollbar-thumb-grey-400
              "
              rows={1}
            />
          </div>

          <button
            type="submit"
            onPointerDown={(e) => e.preventDefault()}
            className="size-9 p-2.5 rounded-full bg-primary flex items-center justify-center"
          >
            <ArrowUpIcon className="size-full text-white" />
          </button>
        </div>
      </div>
    </form>
  );
};
