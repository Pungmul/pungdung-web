"use client";

import { useRef } from "react";

import { Controller } from "react-hook-form";

import { CheckIcon, PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { Dispatch, RefObject, SetStateAction } from "react";

import { useCommentThreadSubmitAction } from "../../../hooks/actions";
import {
  useCommentBottomFieldReset,
  useCommentBottomSendIconHighlight,
  useCommentBottomTextareaHeight,
  useCommentComposerForm,
} from "../../../hooks/form";
import { useCommentNavigation } from "../../../hooks/view-model";
import type { Comment } from "../../../types";

export type CommentComposerProps = {
  postId: number;
  replyTarget: Comment | null;
  setReplyTarget: Dispatch<SetStateAction<Comment | null>>;
  commentAnchorElementsRef: RefObject<
    Record<number, HTMLDivElement | null>
  >;
  composerTextareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function CommentComposer({
  postId,
  replyTarget,
  setReplyTarget,
  commentAnchorElementsRef,
  composerTextareaRef,
}: CommentComposerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const sendIconWrapperRef = useRef<HTMLSpanElement>(null);

  const { adjustHeight } = useCommentBottomTextareaHeight(composerTextareaRef);
  const { setSendIconActive } =
    useCommentBottomSendIconHighlight(sendIconWrapperRef);
  // 제출 직후 한 번에: 입력 비움 · 아이콘 기본 톤 · 높이 재계산
  const { resetCommentInput } = useCommentBottomFieldReset(
    composerTextareaRef,
    setSendIconActive,
    adjustHeight
  );

  // RHF: 본문·익명
  const { control, handleSubmit, reset } = useCommentComposerForm();

  // 제출: 댓글/대댓 mutation + 입력·폼 초기화
  const { submitFromComposer, submitReplyFromComposer } =
    useCommentThreadSubmitAction({
      postId,
      replyTarget,
      setReplyTarget,
      resetCommentInput,
      reset,
    });

  // 답글 대상이 있을 때 원댓의 위치로 스크롤
  const { moveToHash } = useCommentNavigation({
    commentId: replyTarget?.commentId.toString() ?? null,
    commentsRef: commentAnchorElementsRef,
  });

  const formOnSubmit = replyTarget
    ? handleSubmit(submitReplyFromComposer)
    : handleSubmit(submitFromComposer);

  return (
    <form
      ref={formRef}
      onSubmit={formOnSubmit}
      className="sticky bottom-0 w-full shadow-up-md"
    >
      {replyTarget && (
        <div
          className="pl-6 pr-6 h-8 flex flex-row items-center justify-between bg-black/70"
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
            className="flex flex-row gap-2 items-center cursor-pointer py-2"
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
            <div className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center bg-primary">
              <CheckIcon className="w-[12px] h-[12px] text-white stroke-[4px]" />
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
                }}
                placeholder="댓글을 입력하세요..."
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
                    formRef.current?.requestSubmit();
                  }
                }}
                className="bg-transparent border-none outline-none px-4 py-2 flex-grow text-[13px] resize-none overflow-y-auto min-h-[20px] max-h-[120px] scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400"
                rows={1}
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
