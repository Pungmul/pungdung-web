"use client";
import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
  EditProfileFormValues,
  EditProfilePasswordFormValues,
} from "@/features/my-page";
import { transformEditProfileData } from "@/features/my-page/lib";
import { myPageQueryKeys } from "@/features/my-page/constant";
import { useMutation } from "@tanstack/react-query";
import { authMutationOptions } from "@/features/auth/queries";
import { ClubInfo } from "@/features/club";
import { useRouter } from "next/navigation";
import { Toast } from "@/shared";

interface UseEditProfileSubmitParams {
  form: UseFormReturn<EditProfileFormValues>;
  passwordForm: UseFormReturn<EditProfilePasswordFormValues>;
  changedProfileImageFile: File | null;
  clubList?: ClubInfo[];
}

export const useEditProfileSubmit = ({
  form,
  passwordForm,
  changedProfileImageFile,
  clubList,
}: UseEditProfileSubmitParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation(
    authMutationOptions.updateProfile()
  );

  const handleSubmitEditProfile = form.handleSubmit((data) => {
    const formData = new FormData();
    const modifiedProfileData = transformEditProfileData(data, clubList);

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

    console.log(profileImage);

    updateProfile(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: myPageQueryKeys.info(),
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
