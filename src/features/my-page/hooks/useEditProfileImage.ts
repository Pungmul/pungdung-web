"use client";
import { ChangeEvent,useCallback, useState } from "react";

import { UseFormReturn } from "react-hook-form";

import { EditProfileFormValues } from "@/features/my-page";

export const useEditProfileImage = (
  form: UseFormReturn<EditProfileFormValues>
) => {
  const [changedProfileImageFile, setChangedProfileImageFile] =
    useState<File | null>(null);

  const handleProfileImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setChangedProfileImageFile(file);
        form.setValue("profileImage", URL.createObjectURL(file));
      }
    },
    [form]
  );

  return {
    changedProfileImageFile,
    handleProfileImageChange,
  };
};


