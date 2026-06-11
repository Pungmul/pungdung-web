"use client";
import React from "react";

import { cn } from "@/shared";

import { QuestionTypeIcon } from "./QuestionTypeIcon";
import { getQuestionTypeLabel } from "../../lib/question-type";
import type { PromotionQuestionKind } from "../../types";

interface QuestionTypeBadgeProps {
  questionType: PromotionQuestionKind;
  className?: string;
}

export const QuestionTypeBadge = React.memo(function QuestionTypeBadge({
  questionType,
  className = "",
}: QuestionTypeBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-row items-center gap-[4px] px-[8px] py-[4px] bg-grey-100 border border-grey-200 rounded-full w-fit",
        className
      )}
    >
      <div className="text-grey-600 fill-grey-600">
        <QuestionTypeIcon type={questionType} />
      </div>
      <span className="text-[11px] font-medium text-grey-700">
        {getQuestionTypeLabel(questionType)}
      </span>
    </div>
  );
});

QuestionTypeBadge.displayName = "QuestionTypeBadge";
