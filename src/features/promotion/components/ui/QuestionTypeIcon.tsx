"use client";
import React from "react";

import { match } from "ts-pattern";

import { cn } from "@/shared";
import {
  CheckBoxOutline,
  RadioSelectSolid,
  ShortAnswerOutline,
} from "@/shared/components/Icons";

import type { PromotionQuestionKind } from "../../types";

interface QuestionTypeIconProps {
  type: PromotionQuestionKind;
  className?: string;
}

export const QuestionTypeIcon = React.memo(function QuestionTypeIcon({
  type,
  className = "",
}: QuestionTypeIconProps) {
  const icon = match(type)
    .with("TEXT", () => (
      <ShortAnswerOutline className={cn("size-3", className)} />
    ))
    .with("CHOICE", () => (
      <RadioSelectSolid className={cn("size-3", className)} />
    ))
    .with("CHECKBOX", () => (
      <CheckBoxOutline className={cn("size-3", className)} />
    ))
    .otherwise(() => null);

  if (!icon) return null;
  return icon;
});

QuestionTypeIcon.displayName = "QuestionTypeIcon";

