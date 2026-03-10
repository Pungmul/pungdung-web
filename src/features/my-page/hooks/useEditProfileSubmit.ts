"use client";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

import {
  EditProfileFormValues,
  EditProfilePasswordFormValues,
} from "@/features/my-page";

import { Toast } from "@/shared";

import { authMutationOptions } from "@/features/auth/queries";
import { chatQueries } from "@/features/chat/queries";
import { myPageQueryKeys } from "@/features/my-page/constant";
import { transformEditProfileData } from "@/features/my-page/lib";

interface UseEditProfileSubmitParams {
  form: UseFormReturn<EditProfileFormValues>;
  passwordForm: UseFormReturn<EditProfilePasswordFormValues>;
  changedProfileImageFile: File | null;
}

export const useEditProfileSubmit = ({
  form,
  passwordForm,
  changedProfileImageFile,
}: UseEditProfileSubmitParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation(
    authMutationOptions.updateProfile()
  );

  const handleSubmitEditProfile = form.handleSubmit((data) => {
    const formData = new FormData();
    const modifiedProfileData = transformEditProfileData(data);

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
        // 채팅 등 다른 화면이 언마운트된 동안에는 observer가 없어 `active`만으로는 refetch가 스킵된다.
        // 프로필 수정 직후 캐시를 확실히 갱신해야 drawer/모달에 최신 `Member`가 반영된다.
        await queryClient.invalidateQueries({
          queryKey: myPageQueryKeys.all,
          refetchType: "all",
        });
        await queryClient.invalidateQueries({
          queryKey: ["users", "profile-info"],
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
