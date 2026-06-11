"use client";

import { useEffect, useRef } from "react";

import type { RefObject } from "react";

import {
  resolvePostDetailHeader,
  scrollCommentIntoVisibleViewport,
} from "../../lib/scroll-comment-into-visible-viewport";
import type { Comment } from "../../types";

const VV_SETTLE_MS = 80;
const MAX_WAIT_MS = 500;

interface UseReplyTargetScrollParams {
  replyTarget: Comment | null;
  commentAnchorElementsRef: RefObject<Record<number, HTMLDivElement | null>>;
  commentScrollRootRef: RefObject<HTMLElement | null>;
  composerFormRef: RefObject<HTMLElement | null>;
  enabled: boolean;
}

export function useReplyTargetScroll({
  replyTarget,
  commentAnchorElementsRef,
  commentScrollRootRef,
  composerFormRef,
  enabled,
}: UseReplyTargetScrollParams) {
  const lastScrolledCommentIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!replyTarget) {
      lastScrolledCommentIdRef.current = null;
      return;
    }

    const commentId = replyTarget.commentId;

    if (lastScrolledCommentIdRef.current === commentId) {
      return;
    }

    let cancelled = false;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
    let performed = false;

    const tryScroll = () => {
      if (cancelled || performed) {
        return;
      }

      const scrollRoot = commentScrollRootRef.current;
      const target = commentAnchorElementsRef.current[commentId];
      const composer = composerFormRef.current;

      if (!scrollRoot || !target || !composer) {
        return;
      }

      performed = true;
      lastScrolledCommentIdRef.current = commentId;

      scrollCommentIntoVisibleViewport({
        scrollRoot,
        target,
        composerEl: composer,
        headerEl: resolvePostDetailHeader(scrollRoot),
      });
    };

    const scheduleScroll = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(tryScroll);
      });
    };

    const bumpSettle = () => {
      if (settleTimer) {
        clearTimeout(settleTimer);
      }

      settleTimer = setTimeout(scheduleScroll, VV_SETTLE_MS);
    };

    const visualViewport = window.visualViewport;

    if (visualViewport) {
      visualViewport.addEventListener("resize", bumpSettle);
      bumpSettle();
    } else {
      scheduleScroll();
    }

    maxWaitTimer = setTimeout(() => {
      if (!performed) {
        scheduleScroll();
      }
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;

      if (settleTimer) {
        clearTimeout(settleTimer);
      }

      if (maxWaitTimer) {
        clearTimeout(maxWaitTimer);
      }

      visualViewport?.removeEventListener("resize", bumpSettle);
    };
  }, [
    enabled,
    replyTarget,
    commentAnchorElementsRef,
    commentScrollRootRef,
    composerFormRef,
  ]);
}
