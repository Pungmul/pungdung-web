"use client";

import { useCallback } from "react";

import type { RefObject } from "react";

import getScrollableParent from "@/shared/lib/getScrollableParent";

import {
  resolvePostDetailHeader,
  scrollCommentIntoVisibleViewport,
} from "../../lib/scroll-comment-into-visible-viewport";

interface UseCommentNavigationProps {
  commentId: string | null;
  commentsRef: RefObject<Record<number, HTMLDivElement | null>>;
  scrollRootRef?: RefObject<HTMLElement | null>;
  composerFormRef?: RefObject<HTMLElement | null>;
}

export function useCommentNavigation({
  commentId,
  commentsRef,
  scrollRootRef,
  composerFormRef,
}: UseCommentNavigationProps) {
  const moveToHash = useCallback(() => {
    if (!commentId) {
      return;
    }

    const element = commentsRef.current[parseInt(commentId, 10)];

    if (!element) {
      return;
    }

    const scrollRoot = scrollRootRef?.current ?? null;
    const composer = composerFormRef?.current ?? null;

    if (scrollRoot && composer) {
      scrollCommentIntoVisibleViewport({
        scrollRoot,
        target: element,
        composerEl: composer,
        headerEl: resolvePostDetailHeader(scrollRoot),
        extraScrollTopDelta: -element.offsetHeight,
      });
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    const scrollableParent = getScrollableParent(element);
    if (scrollableParent) {
      scrollableParent.scrollTop -= element.offsetHeight;
    }
  }, [commentId, commentsRef, scrollRootRef, composerFormRef]);

  return {
    moveToHash,
  };
}
