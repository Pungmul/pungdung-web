"use client";

import { useCallback, useEffect } from "react";

interface UseCommentNavigationProps {
  commentId: string | null;
  commentsRef: React.RefObject<Record<number, HTMLDivElement | null>>;
}

export const useCommentNavigation = ({
  commentId,
  commentsRef,
}: UseCommentNavigationProps) => {
  const moveToHash = useCallback(() => {
    if (!commentId) {
      return;
    }

    const element = commentsRef.current[parseInt(commentId)];

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [commentId, commentsRef]);

  useEffect(() => {
    moveToHash();
  }, [moveToHash]);

  return {
    moveToHash,
  };
};
