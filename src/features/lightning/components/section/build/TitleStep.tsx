"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";

import { BottomFixedButton, Input } from "@/shared";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../../constants";
import { useTitleStepForm } from "../../../hooks/form";

const F = LIGHTNING_CREATE_FORM_FIELD;

export function TitleStep() {
  const {
    defaultTitle,
    fieldErrors,
    isNextDisabled,
    submitTitleStep,
    title,
    updateTitle,
  } = useTitleStepForm();
  const hasTitle = Boolean(title && title.trim().length > 0);

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-grey-700">모임 제목</label>
          <Input
            value={title || ""}
            placeholder={defaultTitle}
            errorMessage={fieldErrors[F.TITLE]}
            onChange={(e) => updateTitle(e.target.value)}
            trailingComponent={
              hasTitle ? (
                <button
                  type="button"
                  className="flex items-center justify-center rounded p-0.5 text-grey-500 hover:text-grey-700"
                  onClick={() => updateTitle("")}
                  aria-label="제목 지우기"
                >
                  <XCircleIcon className="size-5" />
                </button>
              ) : null
            }
          />
        </div>
      </div>
      <BottomFixedButton
        disabled={isNextDisabled}
        onClick={() => {
          void submitTitleStep();
        }}
      >
        번개 생성
      </BottomFixedButton>
    </>
  );
}
