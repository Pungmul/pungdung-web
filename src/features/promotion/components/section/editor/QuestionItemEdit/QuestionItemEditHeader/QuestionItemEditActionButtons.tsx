"use client";

import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Alert } from "@/shared";

interface QuestionItemEditActionButtonsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const QuestionItemEditActionButtons = ({
  isFirstQuestion,
  isLastQuestion,
  onMoveUp,
  onMoveDown,
  onDelete,
}: QuestionItemEditActionButtonsProps) => {
  return (
    <div className="flex flex-row items-center gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isFirstQuestion) {
            onMoveUp();
          }
        }}
        disabled={isFirstQuestion}
        className={`rounded p-1 size-7 ${
          isFirstQuestion
            ? "cursor-not-allowed bg-grey-300 text-grey-100"
            : "text-grey-600 hover:bg-grey-100"
        }`}
        title={isFirstQuestion ? "이동할 수 없습니다" : "위로 이동"}
      >
        <ArrowUpIcon strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isLastQuestion) {
            onMoveDown();
          }
        }}
        disabled={isLastQuestion}
        className={`rounded p-1 size-7 ${
          isLastQuestion
            ? "cursor-not-allowed bg-grey-300 text-grey-100"
            : "text-grey-600 hover:bg-grey-100"
        }`}
        title={isLastQuestion ? "이동할 수 없습니다" : "아래로 이동"}
      >
        <ArrowDownIcon strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          Alert.confirm({
            title: "질문 삭제",
            message: "정말 질문을 삭제하시겠습니까?",
            onConfirm: () => onDelete(),
            onCancel: () => {},
            confirmText: "삭제",
            cancelText: "취소",
            confirmColor: "red",
          });
        }}
        className="rounded p-1 size-7 hover:bg-red-50"
        title="삭제"
      >
        <TrashIcon className="text-red-500" />
      </button>
    </div>
  );
};
