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
      <button
        type="button"
        aria-expanded={isTypeDropdownOpen}
        aria-haspopup="menu"
        className="flex flex-row items-center rounded bg-grey-200 p-1 text-grey-500 hover:bg-grey-300"
        onClick={(e) => {
          e.stopPropagation();
          setIsTypeDropdownOpen((prev) => !prev);
        }}
      >
        <span className="size-7 p-1" aria-hidden>
          <QuestionTypeIcon type={questionType} className="size-full" />
        </span>
        <span className="px-2 py-1 text-[13px] font-medium text-grey-700">
          {getQuestionTypeLabel(questionType)}
        </span>
        <span className="size-4 flex items-center justify-center" aria-hidden>
          <ChevronDownIcon className={`size-full ${isTypeDropdownOpen ? "-scale-y-100" : ""}`} />
        </span>
      </button>

      {isTypeDropdownOpen && (
        <ul
          role="menu"
          className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-grey-300 bg-background shadow-lg"
        >
          {questionTypes.map((typeOption) => (
            <li role="none" key={typeOption}>
              <button
                type="button"
                role="menuitem"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left ${
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
                <span
                  className={
                    cn("size-7 p-1",
                    typeOption === questionType
                      ? "fill-blue-600 text-blue-600"
                      : "fill-grey-500 text-grey-500"
                    )
                  }
                  aria-hidden
                >
                  <QuestionTypeIcon type={typeOption} className="size-full" />
                </span>
                <span className="text-[13px] font-medium">
                  {getQuestionTypeLabel(typeOption)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
