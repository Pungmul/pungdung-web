"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";

import { clubQueries, useClubOptions } from "@/features/club";

import { Button, Input, Select, Space } from "@/shared";

import { AUTH_UI_MESSAGE, SIGN_UP_FORM_FIELD } from "../../constants";
import { usePersonalStepForm } from "../../hooks/form";
import { formatPhoneNumber } from "../../lib";
import type { PersonalFormData } from "../../types/schemas/email-sign-up.schema";

const PERSONAL_FIELDS = SIGN_UP_FORM_FIELD.PERSONAL;
const PERSONAL_FIELDS_LABEL = AUTH_UI_MESSAGE.PERSONAL_STEP;

interface PersonalStepProps {
  onSubmit: (data: PersonalFormData) => void;
  onPrevStep: () => void;
}

export const PersonalStep: React.FC<PersonalStepProps> = ({
  onSubmit,
  onPrevStep,
}) => {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());
  const clubOptions = useClubOptions(clubList);
  const { register, inputErrors, canSubmit, control, submitPersonalStep } =
    usePersonalStepForm();

  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={(event) => {
        event.preventDefault();
        void submitPersonalStep(onSubmit);
      }}
    >
      <div className="flex-grow px-6">
        <Space h={24} />
        <Input
          label={PERSONAL_FIELDS_LABEL.NAME_LABEL}
          errorMessage={inputErrors.name?.message || ""}
          placeholder={PERSONAL_FIELDS_LABEL.NAME_PLACEHOLDER}
          className="w-full"
          {...register(PERSONAL_FIELDS.NAME)}
        />

        <Space h={24} />
        <Input
          label={PERSONAL_FIELDS_LABEL.NICKNAME_LABEL}
          errorMessage={inputErrors.nickname?.message || ""}
          placeholder={PERSONAL_FIELDS_LABEL.NICKNAME_PLACEHOLDER}
          className="w-full"
          {...register(PERSONAL_FIELDS.NICKNAME)}
        />

        <Space h={24} />
        <Controller
          control={control}
          name={PERSONAL_FIELDS.CLUB}
          render={({ field }) => (
            <Select
              name={PERSONAL_FIELDS.CLUB}
              label={PERSONAL_FIELDS_LABEL.CLUB_LABEL}
              errorMessage={inputErrors.club?.message || ""}
              hasSearch={true}
              placeholder={PERSONAL_FIELDS_LABEL.CLUB_PLACEHOLDER}
              onBlur={field.onBlur}
              onChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              {clubOptions.map((option) => (
                <Select.Option key={option.label + option.value?.toString()} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />

        <Space h={24} />
        <Input
          label={PERSONAL_FIELDS_LABEL.CLUB_AGE_LABEL}
          errorMessage={inputErrors.clubAge?.message || ""}
          placeholder={PERSONAL_FIELDS_LABEL.CLUB_AGE_PLACEHOLDER}
          className="w-full"
          {...register(PERSONAL_FIELDS.CLUB_AGE)}
        />

        <Space h={24} />
        <Controller
          control={control}
          name={PERSONAL_FIELDS.TELL_NUMBER}
          render={({ field }) => (
            <Input
              label={PERSONAL_FIELDS_LABEL.PHONE_LABEL}
              errorMessage={inputErrors.tellNumber?.message || ""}
              placeholder={PERSONAL_FIELDS_LABEL.PHONE_PLACEHOLDER}
              className="w-full"
              type="tel"
              {...field}
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />

        <Space h={24} />
        <Input
          label={PERSONAL_FIELDS_LABEL.INVITE_CODE_LABEL}
          errorMessage={inputErrors.inviteCode?.message || ""}
          placeholder={PERSONAL_FIELDS_LABEL.INVITE_CODE_PLACEHOLDER}
          className="w-full"
          type="number"
          {...register(PERSONAL_FIELDS.INVITE_CODE)}
        />
      </div>

      <div className="w-full sticky bottom-0 left-0 right-0 px-[24px] pb-[32px] pt-[32px] bg-gradient-to-t from-background via-background via-90% to-transparent flex flex-col gap-4 z-50">
        <Button type="button" className="bg-grey-200 text-grey-500" onClick={onPrevStep}>
          {AUTH_UI_MESSAGE.FLOW.BACK}
        </Button>
        <Button className={"bg-red-500 disabled:bg-red-200 text-background"} disabled={!canSubmit} type="submit">
          {canSubmit ? AUTH_UI_MESSAGE.FLOW.NEXT : AUTH_UI_MESSAGE.FLOW.FILL_ALL_FIELDS}
        </Button>
      </div>
    </form>
  );
};
