"use client";
import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { TrashIcon } from "@heroicons/react/24/outline";

import { Input } from "@/shared";

import { QuestionItemEditFormValues } from "../../../../../types/schemas/question-edit.schema";
import { QuestionOptionFieldRow } from "../../../../ui/QuestionOptionFieldRow";
import { QuestionOptionMarker } from "../../../../ui/QuestionOptionMarker";

interface CheckboxQuestionFormProps {
  options: Array<{ id: string; label: string; orderNo: number }>;
  hasOptions: boolean;
  control: Control<QuestionItemEditFormValues>;
  errors: FieldErrors<QuestionItemEditFormValues>;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
}

export const CheckboxQuestionForm = ({
  options,
  hasOptions,
  control,
  errors,
  onAddOption,
  onRemoveOption,
}: CheckboxQuestionFormProps) => {
  const optionErrors = Array.isArray(errors.options) ? errors.options : [];
  const optionsRootError =
    !Array.isArray(errors.options) && errors.options?.message
      ? String(errors.options.message)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="label"
        render={({ field, fieldState }) => (
          <Input
            label="질문"
            placeholder="질문을 입력해주세요."
            className="w-full"
            type="text"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <div className="h-[1px] border-b-2 border-grey-200" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <label className="text-[14px] font-medium text-grey-700">
            선택지
          </label>
          <button
            type="button"
            onClick={onAddOption}
            className="text-[13px] text-blue-500 hover:text-blue-700"
          >
            + 선택지 추가
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {hasOptions &&
            options.map((option, index) => (
              <QuestionOptionFieldRow
                key={option.id}
                marker={<QuestionOptionMarker variant="checkbox" />}
                field={
                  <Controller
                    control={control}
                    name={`options.${index}.label`}
                    render={({ field }) => (
                      <Input
                        placeholder={`선택지 ${index + 1}를 입력해주세요`}
                        className="flex-1"
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        errorMessage={
                          optionErrors[index]?.label?.message
                            ? String(optionErrors[index]?.label?.message)
                            : undefined
                        }
                      />
                    )}
                  />
                }
                trailing={
                  options.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => onRemoveOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <span className="flex size-6 items-center justify-center">
                        <TrashIcon className="size-full" strokeWidth={2} />
                      </span>
                    </button>
                  ) : undefined
                }
              />
            ))}
        </div>
        {optionsRootError && (
          <p className="text-[12px] text-red-500">{optionsRootError}</p>
        )}
      </div>
    </div>
  );
};
