"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";

import { chatQueries } from "@/features/chat";
import { userQueries } from "@/features/user";

import { Toast } from "@/shared";

import { transformEditProfileData } from "../../lib";
import { myPageQueries } from "../../queries";
import type {
  EditProfileFormValues,
  EditProfilePasswordFormValues,
} from "../../types";

import { authMutationOptions } from "@/features/auth/queries";

interface UseEditProfileSubmitParams {
  form: UseFormReturn<EditProfileFormValues>;
  passwordForm: UseFormReturn<EditProfilePasswordFormValues>;
  changedProfileImageFile: File | null;
  serverClubAgeFallback: number;
}

export const useEditProfileSubmit = ({
  form,
  passwordForm,
  changedProfileImageFile,
  serverClubAgeFallback,
}: UseEditProfileSubmitParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation(
    authMutationOptions.updateProfile()
  );

  const handleSubmitEditProfile = form.handleSubmit((data) => {
    const formData = new FormData();
    const modifiedProfileData = transformEditProfileData(data, {
      serverClubAgeFallback,
    });

    const accountData = new Blob(
      [
        JSON.stringify({
          ...modifiedProfileData,
          oldPassword: passwordForm.getValues("oldPassword"),
        }),
      ],
      {
        type: "application/json",
      }
    );

    const profileImage = changedProfileImageFile
      ? new Blob([changedProfileImageFile], {
          type: changedProfileImageFile.type,
        })
      : new Blob([], { type: "image/png" });

    formData.append("accountData", accountData);
    formData.append("profile", profileImage);

    updateProfile(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          ...myPageQueries.all(),
          refetchType: "all",
        });
        await queryClient.invalidateQueries({
          ...userQueries.all(),
          refetchType: "all",
        });
        await queryClient.invalidateQueries({
          ...chatQueries.allRoomInfo(),
          refetchType: "all",
        });
        Toast.show({
          message: "프로필을 성공적으로 수정했어요.",
          type: "success",
          duration: 3000,
        });
        router.back();
      },
      onError: (error) => {
        Toast.show({
          message: "프로필 수정에 실패했어요.\n" + error.message,
          type: "error",
          duration: 3000,
        });
        console.error(error);
      },
    });
  });

  return {
    handleSubmitEditProfile,
    isPending,
  };
};
