"use client";

import Link from "next/link";

import { Controller } from "react-hook-form";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { BottomFixedButton, Checkbox, Space } from "@/shared";

import { AUTH_UI_MESSAGE, SIGN_UP_FORM_FIELD } from "../../constants";
import { useTermStepForm } from "../../hooks/form";
import type { TermsStepFormData } from "../../types/schemas";

const TERMS_FIELDS = SIGN_UP_FORM_FIELD.TERMS;
const TERMS_FIELDS_LABEL = AUTH_UI_MESSAGE.TERMS_STEP;

interface TermsStepProps {
  onSubmit: (data: TermsStepFormData) => void;
}

export const TermsStep: React.FC<TermsStepProps> = ({ onSubmit }) => {
  const { control, isAllChecked, handleAllCheck, submitTermsStep } =
    useTermStepForm();

  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={(event) => {
        event.preventDefault();
        void submitTermsStep(onSubmit);
      }}
    >
      <Space h={24} />
      <div className="flex-grow px-6">
        <Checkbox
          name={TERMS_FIELDS.USING_TERM}
          label={TERMS_FIELDS_LABEL.AGREE_ALL}
          required
          checked={isAllChecked}
          onChange={handleAllCheck}
          className="bg-grey-100 rounded-[6px]"
        />

        <Space h={16} />

        <div className="flex flex-row justify-between items-center">
          <Controller
            control={control}
            name={TERMS_FIELDS.USING_TERM}
            render={({ field }) => (
              <Checkbox
                {...field}
                label={TERMS_FIELDS_LABEL.AGREE_SERVICE}
                required
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Link href="/terms/서비스 이용약관.html" target="_blank">
            <span className="size-6 p-1 flex items-center justify-center cursor-pointer">
              <ChevronRightIcon className="size-full" />
            </span>
          </Link>
        </div>

        <Space h={4} />

        <div className="flex flex-row justify-between items-center">
          <Controller
            control={control}
            name={TERMS_FIELDS.PERSONAL_INFO}
            render={({ field }) => (
              <Checkbox
                label={TERMS_FIELDS_LABEL.AGREE_PRIVACY}
                required
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Link href="/terms/개인정보 처리방침.html" target="_blank">
            <span className="size-6 p-1 flex items-center justify-center cursor-pointer">
              <ChevronRightIcon className="size-full" />
            </span>
          </Link>
        </div>
      </div>
      <BottomFixedButton
        disabled={!isAllChecked}
        type="submit"
        className={"bg-primary disabled:bg-primary-light text-background"}
      >
        {isAllChecked ? AUTH_UI_MESSAGE.FLOW.NEXT : AUTH_UI_MESSAGE.FLOW.AGREE_TERMS_TO_CONTINUE}
      </BottomFixedButton>
    </form>
  );
};
