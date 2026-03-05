"use client";
import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { ClubInfo } from "@/features/club";
import { mapGroupNameToClubId } from "@/features/club";

import { formatPhoneNumber } from "@/features/auth/lib";
import {
  EditProfileFormValues,
  EditProfileSchema,
  MyPageInfo,
} from "@/features/my-page/types";

export const useEditProfileMainForm = (
  schema: EditProfileSchema,
  userData?: MyPageInfo,
  clubList?: ClubInfo[]
) => {
  const defaultValues = useMemo(() => {
    return {
      profileImage: userData?.profile.fullFilePath ?? undefined,
      name: userData?.name ?? "",
      club: mapGroupNameToClubId(userData?.groupName, clubList),
      clubAge: userData?.clubAge?.toString() ?? "",
      nickname: userData?.clubName ?? "",
      tellNumber: formatPhoneNumber(userData?.phoneNumber ?? ""),
    };
  }, [userData, clubList]);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return form;
};
