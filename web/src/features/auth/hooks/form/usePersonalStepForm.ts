"use client";

import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { clubQueries } from "@/features/club";

import { SIGN_UP_FORM_FIELD } from "../../constants";
import { buildPersonalSchema, type PersonalFormData } from "../../types/schemas";

const PERSONAL_FIELDS = SIGN_UP_FORM_FIELD.PERSONAL;

export function usePersonalStepForm() {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());

  const personalPickSchema = useMemo(
    () =>
      buildPersonalSchema(clubList.map((c) => c.clubId)).pick({
        name: true,
        club: true,
        clubAge: true,
        tellNumber: true,
        inviteCode: true,
      }),
    [clubList]
  );

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

    return personalPickSchema
      .safeParse({
        name,
        club,
        clubAge,
        tellNumber,
        inviteCode,
      }).success;
  }, [personalValues, personalPickSchema]);

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
