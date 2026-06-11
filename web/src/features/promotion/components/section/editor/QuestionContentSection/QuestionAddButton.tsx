"use client";
import { useRef, useState } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/outline";

import {
  CheckBoxOutline,
  RadioSelectSolid,
  ShortAnswerOutline,
} from "@/shared/components/Icons";
import { useClickOutside } from "@/shared/hooks";

import type { PromotionQuestionKind } from "../../../../types";

interface QuestionAddButtonProps {
  onSelectQuestionType: (type: PromotionQuestionKind) => void;
}

export const QuestionAddButton = ({ onSelectQuestionType }: QuestionAddButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectorRef = useRef<HTMLUListElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleSelectQuestionType = (type: PromotionQuestionKind) => {
    onSelectQuestionType(type);
    setIsOpen(false);
  };

  useClickOutside({
    refs: [selectorRef, buttonRef],
    enabled: isOpen,
    eventType: "click",
    onOutsideClick: () => setIsOpen(false),
  });

  const handleOpenDropdown = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 152; // 예상 드롭다운 높이 (li 3개 × 약 48px + padding)
      // 버튼 아래쪽에 드롭다운을 표시할 공간이 충분한지 확인
      const spaceBelow = viewportHeight - buttonRect.bottom;

      if (spaceBelow >= dropdownHeight) {
        // setDropdownPosition("bottom");
        selectContainerRef.current?.classList.remove("bottom-0");
        selectContainerRef.current?.classList.add("top-0");
      } else {
        // setDropdownPosition("top");
        selectContainerRef.current?.classList.remove("top-0");
        selectContainerRef.current?.classList.add("bottom-0");
      }
    }
    setIsOpen(true);
  };

  return (
    <div className="relative w-full px-[12px]">
      <div
        ref={buttonRef}
        className="flex flex-row items-center justify-center w-full px-[16px] py-[8px] rounded-lg border border-grey-400 cursor-pointer gap-[4px]"
        onClick={handleOpenDropdown}
      >
        <div className="text-[14px] font-normal text-grey-400">
          설문 추가하기
        </div>
        <span className="flex size-4 items-center justify-center">
          <PlusCircleIcon
            className="size-full text-grey-400"
            strokeWidth={1.5}
          />
        </span>
      </div>
      <div
        className={`absolute w-full px-[12px] left-0`}
        ref={selectContainerRef}
      >
        <ul
          className={`w-full py-[8px] gap-[4px] bg-background rounded-lg border border-grey-400 h-fit z-10 shadow-xs ${
            isOpen ? "block" : "hidden"
          }`}
          ref={selectorRef}
        >
          <li
            className="flex flex-row items-center justify-start w-full px-[16px] py-[8px] cursor-pointer gap-[16px] hover:bg-grey-100"
            onClick={() => handleSelectQuestionType("TEXT")}
          >
            <span className="flex size-4 items-center justify-center">
              <ShortAnswerOutline className="size-full text-grey-400" />
            </span>
            <span className="text-[14px] font-medium text-grey-400">
              단답형
            </span>
          </li>
          <li
            className="flex flex-row items-center justify-start w-full px-[16px] py-[8px] cursor-pointer gap-[16px] hover:bg-grey-100"
            onClick={() => handleSelectQuestionType("CHOICE")}
          >
            <span className="flex size-4 items-center justify-center">
              <RadioSelectSolid className="size-full text-grey-400" />
            </span>
            <span className="text-[14px] font-medium text-grey-400">
              객관식
            </span>
          </li>
          <li
            className="flex flex-row items-center justify-start w-full px-[16px] py-[8px] cursor-pointer gap-[16px] hover:bg-grey-100"
            onClick={() => handleSelectQuestionType("CHECKBOX")}
          >
            <span className="flex size-4 items-center justify-center">
              <CheckBoxOutline className="size-full text-grey-400" />
            </span>
            <span className="text-[14px] font-medium text-grey-400">
              체크 리스트
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
