"use client";

import { useCallback, useRef } from "react";

import { useIOSKeyboardOpacityFix } from "@/shared/hooks/useIOSKeyboardOpacityFix";

interface ChatSendFormProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendImage: (files: FileList) => Promise<void>;
}

export const ChatSendForm: React.FC<ChatSendFormProps> = ({
  onSendMessage,
  onSendImage,
}) => {
  const {
    ref: messageRef,
    onTouchStart: handleTextareaTouchStart,
    onBlur: handleTextareaBlur,
  } = useIOSKeyboardOpacityFix<HTMLTextAreaElement>({
    enabled: true,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = messageRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [messageRef]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const textarea = messageRef.current;
    const message = textarea?.value || "";

    if (!message.trim()) return;

    if (textarea) {
      textarea.value = "";
      adjustHeight();
    }

    await onSendMessage(message);

    textarea?.focus();
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
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    },
    []
  );

  return (
    <form
      ref={formRef}
      className="sticky bottom-0 w-full bg-background shadow-up-md"
      onSubmit={onSubmit}
    >
      <div className="items-center bg-background px-2 py-2">
        <div className="flex flex-row items-end rounded-lg bg-grey-100 px-0.5 py-0.5">
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
            +
          </label>

          <textarea
            ref={messageRef}
            name="comment"
            onTouchStart={handleTextareaTouchStart}
            onBlur={handleTextareaBlur}
            onChange={adjustHeight}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력"
            className="max-h-[120px] min-h-[20px] flex-grow resize-none overflow-y-auto border-none bg-transparent px-4 py-2 text-[12px] outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-grey-300 hover:scrollbar-thumb-grey-400"
            rows={1}
          />

          <button
            type="submit"
            className="h-9 w-9 rounded-full bg-primary text-background"
          >
            ↑
          </button>
        </div>
      </div>
    </form>
  );
};
