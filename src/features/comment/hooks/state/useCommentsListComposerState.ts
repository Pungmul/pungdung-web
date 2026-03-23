"use client";

import { useRef, useState } from "react";

import type { Comment } from "../../types";

/** 댓글 목록 + 하단 composer가 공유하는 로컬 UI 상태 */
export function useCommentsListComposerState() {
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const commentAnchorElementsRef = useRef<Record<number, HTMLDivElement | null>>(
    {}
  );
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const commentScrollRootRef = useRef<HTMLDivElement | null>(null);
  const composerFormRef = useRef<HTMLFormElement | null>(null);
  const applyComposerFocusRef = useRef<(() => boolean) | null>(null);

  return {
    replyTarget,
    setReplyTarget,
    commentAnchorElementsRef,
    composerTextareaRef,
    commentScrollRootRef,
    composerFormRef,
    applyComposerFocusRef,
  };
}
