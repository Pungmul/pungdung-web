"use client";

import { useMemo } from "react";

import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { SIGN_UP_FORM_FIELD } from "../../constants";
import { type PersonalFormData,personalSchema } from "../../types/schemas";

const PERSONAL_FIELDS = SIGN_UP_FORM_FIELD.PERSONAL;

export function usePersonalStepForm() {
  const { register, control, trigger, getValues } =
    useFormContext<PersonalFormData>();
  const { errors: inputErrors } = useFormState({
    control,
    name: Object.values(PERSONAL_FIELDS),
  });

  const personalValues = useWatch({
    control,
    name: [
      PERSONAL_FIELDS.NAME,
      PERSONAL_FIELDS.CLUB,
      PERSONAL_FIELDS.CLUB_AGE,
      PERSONAL_FIELDS.TELL_NUMBER,
      PERSONAL_FIELDS.INVITE_CODE,
    ],
  });

  const canSubmit = useMemo(() => {
    const [name, club, clubAge, tellNumber, inviteCode] = personalValues;

    return personalSchema
      .pick({
        name: true,
        club: true,
        clubAge: true,
        tellNumber: true,
        inviteCode: true,
      })
      .safeParse({
        name,
        club,
        clubAge,
        tellNumber,
        inviteCode,
      }).success;
  }, [personalValues]);

  const submitPersonalStep = async (
    onValid: (data: PersonalFormData) => void
  ) => {
    const isValid = await trigger(Object.values(PERSONAL_FIELDS));

    if (!isValid) {
      return;
    }

    onValid(getValues());
  };

  return {
    register,
    control,
    inputErrors,
    canSubmit,
    submitPersonalStep,
  };
}
