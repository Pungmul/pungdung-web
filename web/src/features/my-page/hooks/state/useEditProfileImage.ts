"use client";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { UseFormReturn } from "react-hook-form";

import type { EditProfileFormValues } from "@/features/my-page/types";

export const useEditProfileImage = (
  form: UseFormReturn<EditProfileFormValues>,
) => {
  const [changedProfileImageFile, setChangedProfileImageFile] =
    useState<File | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  const revokeIfNeeded = useCallback(() => {
    const url = objectUrlRef.current;
    if (url != null) {
      URL.revokeObjectURL(url);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => revokeIfNeeded();
  }, [revokeIfNeeded]);

  const handleProfileImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        revokeIfNeeded();
        const nextUrl = URL.createObjectURL(file);
        objectUrlRef.current = nextUrl;
        setChangedProfileImageFile(file);
        form.setValue("profileImage", nextUrl);
      }
    },
    [form, revokeIfNeeded],
  );

  return {
    changedProfileImageFile,
    handleProfileImageChange,
  };
};
