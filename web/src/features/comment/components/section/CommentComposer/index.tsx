"use client";

import { useEffect, useRef } from "react";

import { Controller } from "react-hook-form";

import { CheckIcon, PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { Dispatch, RefObject, SetStateAction } from "react";

import { useIOSKeyboardOpacityFix } from "@/shared/hooks";
import { cn } from "@/shared/lib";

import { useCommentThreadSubmitAction } from "../../../hooks/actions";
import {
  useCommentBottomFieldReset,
  useCommentBottomSendIconHighlight,
  useCommentBottomTextareaHeight,
  useCommentComposerForm,
} from "../../../hooks/form";
import {
  useCommentNavigation,
  useReplyTargetScroll,
} from "../../../hooks/view-model";
import type { Comment } from "../../../types";

export type CommentComposerProps = {
  postId: number;
  replyTarget: Comment | null;
  setReplyTarget: Dispatch<SetStateAction<Comment | null>>;
  commentAnchorElementsRef: RefObject<
    Record<number, HTMLDivElement | null>
  >;
  composerTextareaRef: RefObject<HTMLTextAreaElement | null>;
  commentScrollRootRef?: RefObject<HTMLDivElement | null>;
  composerFormRef?: RefObject<HTMLFormElement | null>;
  applyComposerFocusRef?: RefObject<(() => boolean) | null>;
  /** anchored: vv 고정 셸 하단 / sticky: 목록 내부 스크롤용 */
  variant?: "anchored" | "sticky";
};

export function CommentComposer({
  postId,
  replyTarget,
  setReplyTarget,
  commentAnchorElementsRef,
  composerTextareaRef,
  commentScrollRootRef,
  composerFormRef,
  applyComposerFocusRef,
  variant = "sticky",
}: CommentComposerProps) {
  const sendIconWrapperRef = useRef<HTMLSpanElement>(null);
  const {
    ref: iosOpacityTextareaRef,
    applyIosKeyboardOpacityFixFocus,
    onFocus: handleIosOpacityFocus,
    onBlur: handleTextareaBlur,
  } = useIOSKeyboardOpacityFix<HTMLTextAreaElement>({ enabled: true });

  const { adjustHeight } = useCommentBottomTextareaHeight(composerTextareaRef);
  const { setSendIconActive } =
    useCommentBottomSendIconHighlight(sendIconWrapperRef);
  const { resetCommentInput } = useCommentBottomFieldReset(
    composerTextareaRef,
    setSendIconActive,
    adjustHeight
  );

  const { control, handleSubmit, reset } = useCommentComposerForm();

  const { submitFromComposer, submitReplyFromComposer } =
    useCommentThreadSubmitAction({
      postId,
      replyTarget,
      setReplyTarget,
      resetCommentInput,
      reset,
    });

  const useAnchoredVvScroll =
    variant === "anchored" && Boolean(commentScrollRootRef);

  useReplyTargetScroll({
    replyTarget,
    commentAnchorElementsRef,
    commentScrollRootRef: commentScrollRootRef ?? { current: null },
    composerFormRef: composerFormRef ?? { current: null },
    enabled: useAnchoredVvScroll,
  });

  const { moveToHash } = useCommentNavigation({
    commentId: replyTarget?.commentId.toString() ?? null,
    commentsRef: commentAnchorElementsRef,
    ...(useAnchoredVvScroll && commentScrollRootRef && composerFormRef
      ? {
        scrollRootRef: commentScrollRootRef,
        composerFormRef,
      }
      : {}),
  });

  useEffect(() => {
    if (!applyComposerFocusRef) {
      return;
    }

    applyComposerFocusRef.current = applyIosKeyboardOpacityFixFocus;

    return () => {
      applyComposerFocusRef.current = null;
    };
  }, [applyComposerFocusRef, applyIosKeyboardOpacityFixFocus]);

  const formOnSubmit = replyTarget
    ? handleSubmit(submitReplyFromComposer)
    : handleSubmit(submitFromComposer);

  return (
    <form
      ref={composerFormRef}
      onSubmit={formOnSubmit}
      className={cn(
        "relative z-20 w-full shrink-0 shadow-up-md",
        variant === "sticky" && "sticky bottom-0",
        variant === "anchored" &&
        "max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:focus-within:pb-0"
      )}
    >
      {replyTarget && (
        <div
          className="absolute bottom-full left-0 right-0 z-10 pl-6 pr-6 h-8 flex flex-row items-center justify-between bg-black/40 backdrop-blur-sm"
          onClick={moveToHash}
        >
          <div className="text-[12px] text-primary">
            @{replyTarget.userName}
          </div>
          <div
            className="size-8 p-1 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              setReplyTarget(null);
            }}
          >
            <XCircleIcon className="size-full text-red-500" />
          </div>
        </div>
      )}
      <div className=" bg-background px-3 py-3 ">
        <div className="flex flex-row h-fit items-end px-4 py-2 rounded-md bg-grey-100">
          <label
            htmlFor="anonymity"
            className="shrink-0 flex flex-row gap-2 items-center cursor-pointer py-2"
          >
            <Controller
              name="anonymity"
              control={control}
              render={({ field }) => (
                <input
                  ref={field.ref}
                  name={field.name}
                  checked={field.value}
                  type="checkbox"
                  id="anonymity"
                  className="hidden peer"
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              )}
            />
            <div className="hidden size-5 peer-checked:flex items-center justify-center rounded-sm bg-primary p-1">
              <CheckIcon className="size-[12px] text-white stroke-[4px]" />
            </div>
            <div className="block w-5 h-5 bg-background peer-checked:hidden rounded-sm" />
            <div className="text-grey-400 peer-checked:text-grey-800 text-[12px]">
              익명
            </div>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                ref={(element) => {
                  field.ref(element);
                  composerTextareaRef.current = element;
                  iosOpacityTextareaRef.current = element;
                }}
                placeholder="댓글을 입력하세요..."
                onTouchStart={applyIosKeyboardOpacityFixFocus}
                onBlur={() => {
                  field.onBlur();
                  handleTextareaBlur();
                }}
                onChange={(event) => {
                  field.onChange(event);
                  setSendIconActive(event.target.value.trim().length > 0);
                  adjustHeight();
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    (composerFormRef ?? { current: null }).current?.requestSubmit();
                  }
                }}
                className="bg-transparent border-none outline-none px-4 py-2 flex-grow text-[13px] resize-none overflow-y-auto min-h-[20px] max-h-[120px] scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400"
                rows={1}
                onFocus={handleIosOpacityFocus}
              />
            )}
          />
          <button type="submit" className="size-9 aspect-square p-1.5">
            <span ref={sendIconWrapperRef} className="size-full text-grey-400">
              <PaperAirplaneIcon className="size-full" />
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
