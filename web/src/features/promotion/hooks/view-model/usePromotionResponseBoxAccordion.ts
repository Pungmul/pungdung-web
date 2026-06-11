"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import type {
  PromotionApplicantAnswer,
  PromotionPublishedQuestion,
} from "../../types";

export function usePromotionResponseBoxAccordion({
  answerList,
  questions,
}: {
  answerList: PromotionApplicantAnswer[];
  questions: PromotionPublishedQuestion[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.orderNo - b.orderNo),
    [questions]
  );

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContentHeight(el.scrollHeight);
  }, [answerList, sortedQuestions, isOpen]);

  const toggle = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  return {
    isOpen,
    contentHeight,
    contentRef,
    toggle,
    sortedQuestions,
  };
}
