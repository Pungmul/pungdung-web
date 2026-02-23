"use client";

import Image from "next/image";

import { type Control,Controller } from "react-hook-form";

import checkMark from "@public/icons/checkMark.svg";

import { QuestionItemEditFormValues } from "../../../../types/schemas/question-edit.schema";

interface QuestionItemEditFooterProps {
  control: Control<QuestionItemEditFormValues>;
  onCancel: () => void;
  onSave: () => void;
  isSaveDisabled: boolean;
}

export const QuestionItemEditFooter = ({
  control,
  onCancel,
  onSave,
  isSaveDisabled,
}: QuestionItemEditFooterProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 border-t border-grey-200 px-3 py-2">
      <label className="flex cursor-pointer flex-row items-center gap-2 px-1">
        <Controller
          control={control}
          name="required"
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              name={field.name}
              className="peer hidden"
            />
          )}
        />
        <div className="hidden h-5 w-5 items-center justify-center rounded-sm peer-checked:flex peer-checked:bg-primary">
          <Image src={checkMark} width={12} height={12} alt="" />
        </div>
        <div className="block h-5 w-5 rounded-sm border border-gray-300 bg-background peer-checked:hidden" />
        <div className="text-xs text-gray-300 peer-checked:text-grey-800">필수 질문</div>
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="cursor-pointer rounded border border-grey-300 bg-background px-2 py-1 text-[13px] text-grey-700 hover:bg-grey-100"
          title="취소"
        >
          취소
        </button>
        <button
          type="button"
          disabled={isSaveDisabled}
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className={`flex items-center gap-1 rounded px-2 py-1 text-[13px] text-white ${
            isSaveDisabled
              ? "cursor-not-allowed bg-grey-300"
              : "cursor-pointer bg-blue-500 hover:bg-grey-700"
          }`}
          title="저장"
        >
          저장
        </button>
      </div>
    </div>
  );
};
