"use client";

import Image from "next/image";

import { useSuspenseQueries } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { CameraIcon } from "@heroicons/react/24/outline";

import { clubQueries, useClubOptions } from "@/features/club";

import {
  BottomFixedButton,
  Input,
  Select,
  Space,
  Spinner,
} from "@/shared";

import { formatPhoneNumber } from "@/features/auth/lib";
import { useEditProfileSubmit } from "@/features/my-page/hooks/actions";
import { useEditProfileMainForm } from "@/features/my-page/hooks/form";
import { useEditProfileImage } from "@/features/my-page/hooks/state";
import { getEditProfileSubmitUiState } from "@/features/my-page/lib/get-edit-profile-submit-ui-state";
import { myPageQueries } from "@/features/my-page/queries";
import type { EditProfilePasswordFormValues } from "@/features/my-page/types";
import { editProfilePasswordSchema } from "@/features/my-page/types";

export function EditProfileForm() {
  const [{ data: userData }, { data: clubList }] = useSuspenseQueries({
    queries: [myPageQueries.info(), clubQueries.list()],
  });
  const clubOptions = useClubOptions(clubList);

  const form = useEditProfileMainForm(userData, clubList);
  const passwordForm = useForm<EditProfilePasswordFormValues>({
    resolver: zodResolver(editProfilePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
    },
  });
  const { changedProfileImageFile, handleProfileImageChange } =
    useEditProfileImage(form);

  const { handleSubmitEditProfile, isPending } = useEditProfileSubmit({
    form,
    passwordForm,
    changedProfileImageFile,
    serverClubAgeFallback: userData.clubAge ?? 0,
  });

  const {
    register,
    control,
    formState: { errors: formErrors },
  } = form;

  const profileImageSrc = useWatch({
    control: form.control,
    name: "profileImage",
  });

  const {
    register: registerPassword,
    formState: {
      errors: passwordErrors,
      isDirty: passwordIsDirty,
      isValid: passwordIsValid,
    },
  } = passwordForm;

  // 버튼 정책을 순수 함수로 분리해 렌더링 책임만 남긴다.
  const submitUiState = getEditProfileSubmitUiState({
    isPending,
    passwordIsDirty,
    passwordIsValid,
  });

  return (
    <form
      className="flex flex-col px-[32px] flex-grow"
      onSubmit={handleSubmitEditProfile}
    >
      <div className="mx-auto relative">
        <label
          htmlFor="profile-image"
          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-grey-800 flex items-center justify-center z-10 cursor-pointer"
        >
          <span className="flex size-6 items-center justify-center">
            <CameraIcon className="size-full text-background" />
          </span>
          <input
            type="file"
            className="hidden"
            id="profile-image"
            name="profile-image"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </label>
        <div className="w-36 aspect-[1] rounded-md border-grey-300 bg-grey-200 border-2 overflow-hidden">
          <div className="relative w-full h-full bg-grey-200">
            {!!profileImageSrc && (
              <Image
                src={profileImageSrc}
                alt="profile"
                fill
                className="object-cover object-center rounded-sm"
              />
            )}
          </div>
        </div>
      </div>
      <Space h={32} />
      <div className="flex flex-col gap-[24px] md:px-[32px] flex-grow">
        <Input label="이름" {...register("name")} disabled={true} />
        <Input
          label="패명"
          {...register("nickname")}
          errorMessage={formErrors.nickname?.message || ""}
        />
        <Controller
          control={control}
          name="club"
          render={({ field }) => (
            <Select
              hasSearch={true}
              label="동아리"
              name="club"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
              errorMessage={formErrors.club?.message || ""}
            >
              {clubOptions.map((option) => (
                <Select.Option key={option.label} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />
        <Input
          label="학번"
          {...register("clubAge")}
          type="number"
          errorMessage={formErrors.clubAge?.message || ""}
        />
        <Controller
          control={control}
          name="tellNumber"
          render={({ field }) => (
            <Input
              label="전화번호"
              errorMessage={formErrors.tellNumber?.message || ""}
              placeholder="전화번호를 입력해주세요."
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
        <Input
          label="현재 비밀번호"
          type="password"
          {...registerPassword("oldPassword")}
          errorMessage={passwordErrors.oldPassword?.message || ""}
          placeholder="현재 비밀번호를 입력해주세요."
          required
        />
      </div>
      <BottomFixedButton
        type="submit"
        disabled={submitUiState.disabled}
        className="bg-primary text-background"
      >
        {submitUiState.showSpinner ? <Spinner /> : submitUiState.label}
      </BottomFixedButton>
    </form>
  );
}
