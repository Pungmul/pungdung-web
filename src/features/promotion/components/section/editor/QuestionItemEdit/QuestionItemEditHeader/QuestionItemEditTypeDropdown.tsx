"use client";

import { useRef, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";
import { useClickOutside } from "@/shared/hooks";

import { getQuestionTypeLabel } from "../../../../../lib/question-type";
import type { PromotionQuestionKind } from "../../../../../types";
import { QuestionTypeIcon } from "../../../../ui/QuestionTypeIcon";

interface QuestionItemEditTypeDropdownProps {
  questionType: PromotionQuestionKind;
  onTypeChange: (newType: PromotionQuestionKind) => void;
}

const questionTypes: PromotionQuestionKind[] = ["TEXT", "CHOICE", "CHECKBOX"];

export const QuestionItemEditTypeDropdown = ({
  questionType,
  onTypeChange,
}: QuestionItemEditTypeDropdownProps) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    enabled: isTypeDropdownOpen,
    onOutsideClick: () => setIsTypeDropdownOpen(false),
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex cursor-pointer flex-row items-center rounded bg-grey-200 p-1 text-grey-500 hover:bg-grey-300"
        onClick={(e) => {
          e.stopPropagation();
          setIsTypeDropdownOpen((prev) => !prev);
        }}
        title="질문 타입 변경"
      >
        <div className="size-7 p-1">
          <QuestionTypeIcon type={questionType} className="size-5" />
        </div>
        <div className="px-2 py-1 text-[13px] font-medium text-grey-700">
          {getQuestionTypeLabel(questionType)}
        </div>
        <ChevronDownIcon className={`size-4 ${isTypeDropdownOpen ? "-scale-y-100" : ""}`} />
      </div>

      {isTypeDropdownOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-lg border border-grey-300 bg-background shadow-lg">
          {questionTypes.map((typeOption) => (
            <div
              key={typeOption}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 first:rounded-t-lg last:rounded-b-lg ${
                typeOption === questionType
                  ? "bg-blue-50 text-blue-500"
                  : "text-grey-600 hover:bg-grey-100"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsTypeDropdownOpen(false);
                onTypeChange(typeOption);
              }}
            >
              <div
                className={
                  cn("size-7 p-1",
                  typeOption === questionType
                    ? "fill-blue-600 text-blue-600"
                    : "fill-grey-500 text-grey-500"
                  )
                }
              >
                <QuestionTypeIcon type={typeOption} className="size-5" />
              </div>
              <span className="text-[13px] font-medium">
                {getQuestionTypeLabel(typeOption)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
